package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.exception.SshException;
import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.engine.service.Visitor;
import dnt.monitor.engine.ssh.*;
import dnt.monitor.engine.support.DefaultSampleManager;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaModel;
import dnt.monitor.meta.ssh.MetaCommand;
import dnt.monitor.meta.ssh.MetaMapping;
import dnt.monitor.model.*;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.support.DefaultGeneralMap;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

import static org.apache.commons.lang.exception.ExceptionUtils.getRootCause;


/**
 * <h1>SSH采集服务</h1>
 *
 * @author Jay Xiong
 */
@SuppressWarnings("unchecked")
@Service
class SshSampleManager extends DefaultSampleManager {
    @Autowired
    SshVisitorFactory visitorFactory;

    @Autowired
    CommandExecutor commandExecutor;

    @Autowired
    MappingHandler mappingHandler;

    @Autowired
    SshFieldComputer sshFieldComputer;

    @Override
    protected Visitor visitor(ResourceNode node) throws SampleException {
        SshCredential credential = node.getCredential(SshCredential.class);
        if (credential == null)
            throw new SampleException("There is no ssh credential in " + node);
        try {
            return visitorFactory.visitor(node, credential);
        } catch (SshException e) {
            throw new SampleException("Can't get ssh visitor to " + node);
        }
    }

    @Override
    protected void returnBackVisitor(ResourceNode node, Visitor visitor) {
        visitorFactory.returnBack(node, (SshVisitor) visitor);
    }

    @Override
    protected List<GeneralMap<String, Object>> sampleSingleInstance(Visitor visitor, ResourceNode node,
                                                                    MetaModel metaModel,
                                                                    boolean onlyKeyed) throws SampleException {
        List<GeneralMap<String, Object>> result = new ArrayList<GeneralMap<String, Object>>();
        List<MetaCommand> commands = metaModel.getCommands();
        List<MetaMapping> mappings = metaModel.getMappings();

        for (int i = 0; i < commands.size(); i++) {
            MetaCommand command = commands.get(i);
            MetaMapping mapping = i < mappings.size() ? mappings.get(i) : null;
            if (command == null || mapping == null) {
                continue;
            }
            String resultText;
            try {
                resultText = commandExecutor.execute(command, (SshVisitor) visitor);
            } catch (Exception ex) {
                logger.error("execute-command failed,node={},model={},reason={},cause={}", getNodeName(node),
                             metaModel.getName(), ex.getMessage(), getRootCause(
                                ex)
                            );
                continue;
            }

            GeneralMap<String, Object> dataMap;
            try {
                dataMap = mappingHandler.handleMap(mapping, resultText);
            } catch (Exception ex) {
                logger.error("mapping failed,node={},model={},text={},reason={},cause={}", getNodeName(node),
                             metaModel.getName(), resultText, ex.getMessage(), getRootCause(ex));
                continue;
            }

            if (dataMap.size() == 0) {
                continue;
            }
            result.add(dataMap);
        }
        return result;
    }

    @Override
    protected List<GeneralMap<String, Object>> sampleMultipleInstance(Visitor visitor, ResourceNode node, MetaModel metaModel,
                                                               boolean onlyKeyed) throws SampleException {
        List<GeneralMap<String, Object>> result = new ArrayList<GeneralMap<String, Object>>();
        List<MetaCommand> commands = metaModel.getCommands();
        List<MetaMapping> mappings = metaModel.getMappings();

        if (commands.size() > 0) {
            MetaCommand command = commands.get(0);  //组件和Entry不存在继承，所以最多只有一个Command
            MetaMapping mapping = mappings.size() > 0 ? mappings.get(0) : null;
            if (command != null && mapping != null) {
                String resultText = null;
                try {
                    resultText = commandExecutor.execute(command, (SshVisitor) visitor);
                } catch (Exception ex) {
                    logger.error("execute-command failed,node={},model={},reason={},cause={}", getNodeName(node),
                                 metaModel.getName(), ex.getMessage(), getRootCause(
                                    ex)
                                );
                }
                if (StringUtils.isNotBlank(resultText)) {
                    try {
                        result.addAll(mappingHandler.handleTable(mapping, resultText));
                    } catch (Exception ex) {
                        logger.error("mapping failed,node={},model={},text={},reason={},cause={}", getNodeName(node),
                                     metaModel.getName(), resultText, ex.getMessage(), getRootCause(ex));
                    }
                }
            }
        }
        return result;
    }

    @Override
    protected GeneralMap<String, Object> sampleField(Visitor visitor, ResourceNode node, MetaModel metaModel, Object model,
                                              MetaField metaField, boolean onlyKeyed) throws SampleException {
        GeneralMap<String,Object> result = new DefaultGeneralMap<String, Object>();
        MetaCommand metaCommand = metaField.getCommand();
        if (metaCommand == null) {
            return null;
        }
        MetaCommand transCommand = new MetaCommand();
        transCommand.setTimeout(metaCommand.getTimeout());
        try {
            transCommand.setValue(transCommand(model, metaCommand.getValue()));
        } catch (Exception ex) {
            logger.error("execute command failed,node={},model={},field={},command={},reason={}", getNodeName(node),
                         metaModel.getName(), metaField.getName(), metaCommand.getValue(), ex.getMessage());
            return null;
        }

        String vText;
        try {
            vText = commandExecutor.execute(transCommand, (SshVisitor) visitor);
        } catch (Exception ex) {
            logger.error("execute-command failed,node={},model={},field={},command={},reason={},cause={}", getNodeName(node),
                         metaModel.getName(), metaField.getName(), metaCommand.getValue(),ex.getMessage(), getRootCause(ex)
                        );
            return null;
        }

        if (metaField.getMapping() == null) {
            result.put(metaField.getName(),vText);
        } else {
            try {
                result.putAll(mappingHandler.handleMap(metaField.getMapping(), vText));
            } catch (Exception ex) {
                logger.error("mapping failed,node={},model={},field={},text={},reason={},cause={}", getNodeName(node),
                                                     metaModel.getName(), metaField.getName(),vText, ex.getMessage(), getRootCause(ex));
                return null;
            }
        }
        return result;
    }

    /**
     * 对Command指令做转换，将${varName}部分的变量引用替换为实际值
     */
    private String transCommand(Object model, String oldCommand) throws SampleException {
        StringBuilder newCommand = new StringBuilder();
        StringBuilder tempWord = new StringBuilder();
        boolean inWord = false;
        for (int i = 0; i < oldCommand.length(); i++) {
            char c = oldCommand.charAt(i);
            if (!inWord && c == '$' && i + 1 < oldCommand.length() && oldCommand.charAt(i + 1) == '{') {
                inWord = true;
                i++;
                tempWord.setLength(0);
                continue;
            }
            if (inWord) {
                if (c == '}') {
                    String varName = tempWord.toString();
                    try {
                        Object varValue = PropertyUtils.getProperty(model, varName);
                        newCommand.append(varValue.toString());
                    } catch (Exception ex) {
                        throw new SampleException("${" + varName + "} is null or not exist");
                    }
                    inWord = false;
                    tempWord.setLength(0);
                } else {
                    tempWord.append(c);
                }
            } else {
                newCommand.append(c);
            }
        }
        return newCommand.toString();
    }

    @Override
    protected FieldComputer getFieldComputer() {
        return sshFieldComputer;
    }
}
