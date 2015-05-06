package dnt.monitor.engine.shell.support;

import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.engine.shell.CommandExecutor;
import dnt.monitor.engine.shell.MappingHandler;
import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.engine.support.DefaultGenericSampleManager;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.shell.*;
import net.happyonroad.model.Credential;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.support.DefaultGeneralMap;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.apache.commons.lang.exception.ExceptionUtils.getMessage;

/**
 * <h1>Shell Sample Manager</h1>
 * <p/>
 * 支持本地Shell和远程SSH采集
 *
 * @author Jay Xiong
 */
@Component
class ShellSampleManager extends DefaultGenericSampleManager<ShellVisitor> {
    static final Pattern INTERPOLATE_PTN = Pattern.compile("\\$\\{([^}]+)\\}");

    @Autowired
    CommandExecutor commandExecutor;

    @Autowired
    MappingHandler mappingHandler;

    @Autowired
    ShellFieldComputer shellFieldComputer;

    public ShellSampleManager() {
        //本地Shell认证优先级比较高，高于 Ssh等原创方式
        setOrder(Integer.MIN_VALUE);
    }

    @Override
    protected String supportedCredentials() {
        return Credential.Local + "," + Credential.Ssh;
    }

    @Override
    protected GeneralMap<String, Object> sampleSingleInstance(ShellVisitor visitor,
                                                              MetaModel metaModel,
                                                              MetaRelation metaRelation,
                                                              boolean onlyKeyed) throws SampleException {
        //可能找出多个适应于当前资源的命令/映射对
        //例如，在父类上指定了一套适用于所有os的通用命令，采集部分父类信息；在子类上指定了当前os的指令，采集部分子类信息
        String type = getResourceType(visitor);
        MetaShell shell = null;
        if (metaRelation != null) {
            //在relation上定义的
            shell = metaRelation.getAttribute(MetaShell.class);
        }
        // relation上有shell的定义
        if (shell != null) {
            MetaShell modelShell = metaModel.getAttribute(MetaShell.class);
            modelShell.merge(shell);
            shell = modelShell;
        } else {
            shell = metaModel.getAttribute(MetaShell.class);
        }
        DefaultGeneralMap<String, Object> map = new DefaultGeneralMap<String, Object>();
        if (shell == null) {
            return map;
        }
        List<MetaCommand> theCommands = shell.getCommands(type);
        List<MetaMapping> theMappings = shell.getMappings(type);
        for (int i = 0; i < theCommands.size(); i++) {
            MetaCommand command = theCommands.get(i);
            MetaMapping mapping = i < theMappings.size() ? theMappings.get(i) : null;
            if (command == null || mapping == null) {
                continue;
            }
            String[] args = shell.getArgs(type);
            String resultText;
            try {
                resultText = commandExecutor.execute(command, visitor, args);
            } catch (Exception ex) {
                logger.error("Execute `{}: args={}` failed, model={}, cause={}",
                             command.getValue(), StringUtils.join(args, " "), metaModel.getName(),
                             getMessage(ex));
                continue;
            }

            GeneralMap<String, Object> dataMap;
            try {
                dataMap = mappingHandler.handleMap(mapping, resultText);
            } catch (Exception ex) {
                logger.error("Mapping: {} against {} failed, model={}, cause={}",
                             mapping.getValue(), resultText, metaModel.getName(), getMessage(ex));
                continue;
            }

            if (dataMap.isEmpty()) {
                continue;
            }
            map.putAll(dataMap);
        }
        return map;
    }

    @Override
    protected List<GeneralMap<String, Object>> sampleMultipleInstance(ShellVisitor visitor,
                                                                      MetaModel metaModel,
                                                                      MetaRelation metaRelation,
                                                                      boolean onlyKeyed,
                                                                      Object... anArgs) throws SampleException {
        List<GeneralMap<String, Object>> result = new ArrayList<GeneralMap<String, Object>>();
        MetaShell shell = null;
        if (metaRelation != null) {
            //在relation上定义的
            shell = metaRelation.getAttribute(MetaShell.class);
        }
        // relation上有shell的定义
        if (shell != null) {
            MetaShell modelShell = metaModel.getAttribute(MetaShell.class);
            modelShell.merge(shell);
            shell = modelShell;
        } else {
            shell = metaModel.getAttribute(MetaShell.class);
        }
        if (shell == null) return result;
        String resourceType = getResourceType(visitor);
        List<MetaCommand> commands = shell.getCommands(resourceType);
        List<MetaMapping> mappings = shell.getMappings(resourceType);
        if (commands.isEmpty()) {
            return result;
        }
        for (int i = 0; i < commands.size(); i++) {
            MetaCommand command = commands.get(i);
            MetaMapping mapping = i < mappings.size() ? mappings.get(i) : null;
            if (command == null || mapping == null) {
                continue;
            }
            String[] configuredArgs = shell.getArgs(resourceType);
            List<String> argsList = new ArrayList<String>(configuredArgs.length + anArgs.length);
            argsList.addAll(Arrays.asList(configuredArgs));
            for (Object arg : anArgs) {
                if (arg != null) argsList.add(arg.toString());
                else argsList.add("");
            }
            String resultText = null;
            try {
                String[] argsArray = argsList.toArray(new String[argsList.size()]);
                resultText = commandExecutor.execute(command, visitor, argsArray);
            } catch (Exception ex) {
                logger.error("Execute `{}: args={}` failed, model={}, cause={}",
                             command.getValue(), StringUtils.join(argsList, " "),
                             metaModel.getName(), getMessage(ex));
            }
            if (StringUtils.isNotBlank(resultText)) {
                try {
                    List<GeneralMap<String, Object>> maps = mappingHandler.handleTable(mapping, resultText);
                    result.addAll(maps);
                } catch (Exception ex) {
                    logger.error("Mapping: {} against {} failed, model={}, cause={}",
                                 mapping.getValue(), resultText, metaModel.getName(), getMessage(ex));
                }
            }
        }
        return result;
    }

    @Override
    protected GeneralMap<String, Object> sampleField(ShellVisitor visitor,
                                                     MetaModel metaModel,
                                                     Object model,
                                                     MetaField metaField,
                                                     boolean onlyKeyed) throws SampleException {
        GeneralMap<String, Object> result = new DefaultGeneralMap<String, Object>();
        MetaShell shell = metaField.getAttribute(MetaShell.class);
        if (shell == null) {
            return null;
        }
        String type = getResourceType(visitor);
        MetaCommand command = shell.getCommand(type);
        MetaMapping mapping = shell.getMapping(type);
        if (command == null) return null;
        MetaCommand transCommand = new MetaCommand();
        transCommand.setTimeout(command.getTimeout());
        try {
            String newCommand = interpolate(command.getValue(), model);
            transCommand.setValue(newCommand);
        } catch (Exception ex) {
            logger.error("Interpret {} of {}.{} failed, reason={}",
                         command.getValue(), metaModel.getName(), metaField.getName(), getMessage(ex));
            return null;
        }
        String[] args = shell.getArgs(type);
        String vText;
        try {
            vText = commandExecutor.execute(transCommand, visitor, args);
        } catch (Exception ex) {
            logger.error("Execute: `{}` failed, model={}, cause={}",
                         command.getValue(), metaModel.getName(), getMessage(ex));
            return null;
        }

        if (mapping == null) {
            result.put(metaField.getName(), vText);
        } else {
            try {
                result.putAll(mappingHandler.handleMap(mapping, vText));
            } catch (Exception ex) {
                logger.error("mapping failed,model={},field={},text={},reason={},cause={}",
                             metaModel.getName(), metaField.getName(), vText, ex.getMessage(), getMessage(ex));
                return null;
            }
        }
        return result;
    }


    public String interpolate(String origin, Object model) throws SampleException {
        Matcher m = INTERPOLATE_PTN.matcher(origin);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            String variable = m.group(1);
            Object replacement = resolveVariable(model, variable);
            try {
                m.appendReplacement(sb, String.valueOf(replacement));
            } catch (IllegalArgumentException e) {
                e.printStackTrace();//just for catch it to debug
                throw e;
            }
        }
        m.appendTail(sb);
        return sb.toString().trim();
    }

    private Object resolveVariable(Object model, String variable) throws SampleException {
        try {
            return PropertyUtils.getProperty(model, variable);
        } catch (Exception ex) {
            throw new SampleException("Error while interpolate " + variable + " from " + model);
        }
    }


    @Override
    protected FieldComputer getFieldComputer() {
        return shellFieldComputer;
    }
}
