/**
 * Developer: Kadvin Date: 14/11/11 下午1:40
 */
package dnt.monitor.server;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.RegexFileFilter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Configure the monitor server instance
 *
 * java -jar path/to/monitor/server/release.jar path/to/app/folder path/to/vars [path/to/output]
 */
public class Configure {
    private static final Pattern INTERPOLATE_PTN = Pattern.compile("#\\{([^}]+)\\}");

    public static void main(String[] args) throws Exception {
        if (args.length < 1)
            throw new IllegalArgumentException("You should specify the app folder as first argument");
        File appFolder = new File(args[0]);
        if (!appFolder.exists())
            throw new IllegalArgumentException("The app folder `" + appFolder.getAbsolutePath() + "` does not exist!");
        if (args.length < 2)
            throw new IllegalArgumentException("You should specify the variables file as second argument");
        File varsFile = args[1].startsWith("/") ? new File(args[1]) : new File(appFolder, args[1]);
        if(!varsFile.exists())
            throw new IllegalArgumentException("The vars file `" +varsFile.getAbsolutePath()+ "` does not exist! ");
        File outputFolder = args.length < 3 ? appFolder : new File(args[2]);
        if( !outputFolder.exists() ) FileUtils.forceMkdir(outputFolder);

        Properties variables = loadProperties(varsFile);
        String fwkVersion = getFwkVersion(appFolder);
        String relVersion = getRelVersion(appFolder);
        variables.setProperty("app.fwkVersion", fwkVersion);
        variables.setProperty("app.version", relVersion);
        variables.setProperty("app.base", FilenameUtils.normalize(appFolder.getAbsolutePath()));
        File mappingFile = new File(appFolder, "resources/.mapping");
        if( !mappingFile.exists() )
            throw new IllegalArgumentException("The app folder `" +appFolder.getAbsolutePath()+ "` should contains resource/.mapping!");
        Properties mappings = loadProperties(mappingFile);
        Set<String> resources = mappings.stringPropertyNames();
        for (String resource : resources) {
            String destination = mappings.getProperty(resource);
            // 路径当中也可能有变量
            destination = interpolate(destination, variables);
            if( destination.endsWith("/") ) destination = destination + resource;
            File template = new File(appFolder, "resources/" + resource);
            if( !template.exists() ) {
                System.err.println("The template file " + resource + " does exist, check your mapping file, ignore it");
                continue;
            }
            File destFile = destination.startsWith("/") ? new File(destination) : new File(outputFolder, destination);
            if( destination.startsWith("/") ){
                try {
                    FileUtils.touch(destFile);
                } catch (IOException e) {
                    System.err.println("Can't touch " + destFile + ", ignore it");
                    continue;
                }
            }
            FileUtils.forceMkdir(destFile.getParentFile());
            interpolate(template, variables, destFile);
            System.out.println("Interpolated " + template.getName() + " => " + destFile.getAbsolutePath());
        }
        System.out.println("Configure " + appFolder.getAbsolutePath() + " with " + varsFile.getAbsolutePath());
    }

    private static String interpolate(String originString, Properties variables) {
        Matcher m = INTERPOLATE_PTN.matcher(originString);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            String variable = m.group(1);
            String replacement = variables.getProperty(variable);
            if( replacement == null )
                throw new IllegalStateException("Missing variable " + variable);
            //解析出来的变量可能还需要再解析
            if (INTERPOLATE_PTN.matcher(replacement).find()) {
                replacement = interpolate(replacement, variables);
            }
            try {
                m.appendReplacement(sb, replacement);
            } catch (IllegalArgumentException e) {
                e.printStackTrace();//just for catch it to debug
                throw e;
            }
        }
        m.appendTail(sb);
        return sb.toString().trim();
    }

    private static void interpolate(File template, Properties variables, File dest) throws Exception{
        FileInputStream fis = new FileInputStream(template);
        FileOutputStream fos = new FileOutputStream(dest);
        List<String> lines;
        try {
            lines = IOUtils.readLines(fis);
        } finally {
            IOUtils.closeQuietly(fis);
        }
        List<String> newLines = new ArrayList<String>(lines.size());
        for (String line : lines) {
            if( line.startsWith("#") )
                newLines.add(line);
            else
                newLines.add(interpolate(line, variables));
        }
        try {
            IOUtils.writeLines(newLines, "\n", fos);
        } finally {
            IOUtils.closeQuietly(fos);
        }
    }

    private static Properties loadProperties(File file) throws Exception{
        FileInputStream fis = new FileInputStream(file);
        Properties props = new Properties();
        try {
            props.load(fis);
        } finally {
            IOUtils.closeQuietly(fis);
        }
        return props;
    }

    private static String getFwkVersion(File appFolder){
        return getVersion(new File(appFolder, "boot"), "net\\.happyonroad\\.spring-component-framework-.*", "spring-component-framework-");
    }

    private static String getRelVersion(File appFolder) {
        return getVersion(new File(appFolder, "lib"), "dnt\\.itsnow\\.release-.*", "release-");
    }

    private static String getVersion(File folder, String pattern, String start){
        IOFileFilter fileFilter = new RegexFileFilter(pattern);
        Collection<File> jars = FileUtils.listFiles(folder, fileFilter, null);
        if( jars.isEmpty() )
        {
            //return "0.0.1";// an minimal one for testing
            throw new IllegalStateException("Can't auto detect the version of " + pattern);
        }
        File jar = jars.iterator().next();
        int begin = jar.getName().indexOf(start) + start.length();
        int end = jar.getName().lastIndexOf(".jar");
        return jar.getName().substring(begin, end);
    }
}
