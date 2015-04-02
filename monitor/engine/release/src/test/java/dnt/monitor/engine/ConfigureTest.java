package dnt.monitor.engine;

import net.happyonroad.util.TempFile;
import org.apache.commons.io.IOUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@Ignore("The release path is related to env")
public class ConfigureTest {
    File tempFolder = TempFile.tempFolder();
    Properties props = new Properties();

    @Test
    public void testMain() throws Exception {
        Configure.main(new String[]{
                "/opt/insight/itsnow/backend/release",
                "resources/sample.vars",
                tempFolder.getAbsolutePath()});

        assertExists("bin/itsnow_dnt");
        assertExists("bin/start.bat");
        assertExists("bin/stop.bat");
        assertExists("bin/start.sh");
        assertExists("bin/stop.sh");

        assertExists("config/engine.properties");
        assertExists("config/nginx.conf");
        assertExists("config/logback.xml");
        assertExists("config/wrapper.conf");

        assertExists("db/migrate/environments/development.properties");

        //assertExists("/usr/my.cnf");
        //assertExists("/etc/redis.conf");

        //仅以now.properties为例子，检查interpolate的效果

        FileInputStream fis = new FileInputStream(new File(tempFolder, "config/engine.properties"));
        props.load(fis);
        IOUtils.closeQuietly(fis);

        assertProperty("dnt", "app.id");
        assertProperty("itsnow_dnt", "app.name");
        assertProperty("itsnow.com", "app.domain");
        assertProperty("srv1.itsnow.com", "msc.host");
        assertProperty("srv1.itsnow.com", "redis.global.host");

    }

    protected void assertExists(String path) {
        assertTrue(new File(tempFolder, path).exists());
    }

    protected void assertProperty(String value, String name){
        assertEquals(value , props.getProperty(name));
    }
}