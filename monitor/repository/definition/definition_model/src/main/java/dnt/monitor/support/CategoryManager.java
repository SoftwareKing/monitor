/**
 * Developer: Kadvin Date: 14/12/27 下午9:28
 */
package dnt.monitor.support;

import dnt.monitor.model.ManagedObject;
import dnt.monitor.model.Resource;
import dnt.monitor.service.CategoryService;
import net.happyonroad.model.Category;
import net.happyonroad.spring.ApplicationSupportBean;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.*;

/**
 * <h1>缺省的类别服务</h1>
 */
@ManagedResource(objectName = "dnt.monitor:name=categoryService")
@Component
class CategoryManager extends ApplicationSupportBean
        implements CategoryService, Comparator<String>{

    //类别（多根)
    private List<Category>            roots       = new LinkedList<Category>();
    //所有的认证方式的名称
    private Set<String>               credentials = new HashSet<String>();

    @Override
    public String resolveType(Class<? extends Resource> klass) {
        List<dnt.monitor.annotation.Category> annotations = new ArrayList<dnt.monitor.annotation.Category>(4);
        Class theClass = klass;
        do{
            dnt.monitor.annotation.Category annotation =
                    (dnt.monitor.annotation.Category) theClass.getAnnotation(dnt.monitor.annotation.Category.class);
            if( annotation != null ) annotations.add(annotation);
            //noinspection unchecked
            theClass = theClass.getSuperclass();
        } while(theClass != ManagedObject.class);
        StringBuilder stringBuilder = new StringBuilder();
        Collections.reverse(annotations);
        Iterator<dnt.monitor.annotation.Category> it = annotations.iterator();
        while (it.hasNext()) {
            dnt.monitor.annotation.Category annotation = it.next();
            stringBuilder.append(annotation.value());
            if( it.hasNext() && !annotation.value().equals("/") ) stringBuilder.append("/");
        }
        return stringBuilder.toString();
    }

    @Override
    public Category resolve(Class<? extends Resource> klass) {
        //such as: "/", "/device/host", "/device/host/linux"
        String type = resolveType(klass);
        try{
            return parseCategory(type);
        }catch (IllegalArgumentException ex){
            dnt.monitor.annotation.Category annotation = AnnotationUtils.findAnnotation(klass, dnt.monitor.annotation.Category.class);
            return register(type, annotation);
        }
    }

    Category register(String type, dnt.monitor.annotation.Category annotation) {
        String parentType;
        // 处理根类型，其parent应为 null
        if (type.equals("/")) parentType = null;
        // 处理非根类型
        else parentType = type.substring(0, type.lastIndexOf("/"));
        // 如果parent type 算出来为 空字符串，则设置为根
        if ("".equals(parentType)) parentType = "/";

        Category category = new Category();
        category.setName(type.substring(type.lastIndexOf("/") + 1));
        if ("".equals(category.getName())) category.setName("/");
        category.setAlias(annotation.alias());
        category.setDescription(annotation.description());
        category.setCredentials(annotation.credentials());
        credentials.addAll(Arrays.asList(category.getCredentials()));
        register(category, parentType);
        return category;
    }

    /////////////////////////////////////////////
    // Category Service 实现
    /////////////////////////////////////////////

    @Override
    public List<Category> getCategories() {
        return Collections.unmodifiableList(roots);
    }

    @Override
    public Set<String> getCredentials() {
        return credentials;
    }

    @Override

    public Category parseCategory(String type) throws IllegalArgumentException {
        String[] parts = type.split("/");
        if (parts.length == 0 ) parts = new String[]{"/"};
        List<Category> scope = roots;
        Category found = null;
        for (String part : parts) {
            found = candidate(scope, part);
            if (found == null) break;
            scope = found.getChildren();
        }
        if (found != null) return found;
        throw new IllegalArgumentException("Can't find category for type: " + type);
    }

    private Category candidate(List<Category> categories, String name) {
        if (categories == null) return null;
        for (Category category : categories) {
            if (name.equals(category.getName()) || name.equals(category.getAlias()))
                return category;
        }
        return null;
    }

    @Override
    public boolean register(Category category, String parentType) throws IllegalArgumentException {
        Category parent = null;
        if (parentType != null) {
            parent = parseCategory(parentType);
            category.setParent(parent);
            Set<String> credentials = new HashSet<String>();
            credentials.addAll(Arrays.asList(parent.getCredentials()));
            credentials.addAll(Arrays.asList(category.getCredentials()));
            category.setCredentials(credentials.toArray(new String[credentials.size()]));
        }
        String type = category.getType();
        try {
            parseCategory(type);
            return false; //exist
        } catch (IllegalArgumentException e) {
            if (parent == null) {
                roots.add(category);
            } else {
                parent.addChild(category);
            }
            registerMbean(category, objectName(category));
            return true;
        }
    }

    @Override
    public List<String> getTypes() {
        List<String> types = new LinkedList<String>();
        for (Category root : roots) {
            dumpTypes(root, types);
        }
        Collections.sort(types, this);
        return types;
    }

    @Override
    public int compare(String t1, String t2) {
        return Category.depth(t1) - Category.depth(t2);
    }

    private void dumpTypes(Category category, List<String> types) {
        types.add(category.getType());
        if( category.getChildren() != null )
            for (Category child : category.getChildren()) {
                dumpTypes(child, types);
            }
    }

    /////////////////////////////////////////////
    // 可管理性
    /////////////////////////////////////////////
    ObjectName objectName(Category category) {
        try {
            // dnt.categories.host       => dnt.categories:type=root,name=host
            // dnt.categories.host.linux => dnt.categories:type=host,name=linux
            return new ObjectName("dnt.monitor:type=categories,name=" + category.getType());
        } catch (MalformedObjectNameException e) {
            throw new RuntimeException("Can't create object name for category:" + category, e);
        }
    }

    @ManagedAttribute
    public int getRootSize(){
        return roots.size();
    }

    @ManagedAttribute
    public String getOverview() {
        StringWriter writer = new StringWriter();
        PrintWriter out = new PrintWriter(writer);
        for (Category root : roots) {
            output(out, root, 0);
        }
        return writer.toString();
    }

    @ManagedOperation
    public void dump(String fileName) throws IOException{
        PrintStream stream = new PrintStream(fileName);
        PrintWriter out = new PrintWriter(stream);
        try{
            for (Category root : roots) {
                output(out, root, 0);
            }
            out.flush();
        }finally {
            stream.close();
        }
    }

    protected void output(PrintWriter sb, Category category, int indent) {
        for (int i = 0; i < indent; i++) sb.append("    ");
        sb.append(category.getName()).append("\n");
        if(category.getChildren() == null) return;
        for (Category child : category.getChildren()) {
            output(sb, child, indent + 1);
        }
    }
}
