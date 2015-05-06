package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaSnmpCommand;
import dnt.monitor.meta.sampling.MappingType;
import dnt.monitor.meta.sampling.MetaCommand;
import dnt.monitor.meta.sampling.PacksData;
import dnt.monitor.service.sampling.CommandHandler;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.ParseUtils;
import org.springframework.stereotype.Component;

@Component
class SnmpCommandHandler extends Bean implements CommandHandler<MibAwareSnmpVisitor> {

    @Override
    public PacksData execute(MibAwareSnmpVisitor visitor, MetaCommand metaCommand, String... args) throws SampleException {
        //snmp不支持参数传递, so ignore "args"

        if (!(metaCommand instanceof MetaSnmpCommand)) {
            return null;
        }
        MetaSnmpCommand command = (MetaSnmpCommand) metaCommand;
        PacksData data = new PacksData();
        try {
            if (command.getMappingType() == MappingType.TABLE) {
                data.put(command.getMappingName(),
                         visitor.table(TimeInterval.parseInt(command.getTimeout()), command.getValue(),
                                       command.getPrefix())
                        );
            } else if (command.getMappingType() == MappingType.MAP) {
                data.put(command.getMappingName(),
                         visitor.walk(TimeInterval.parseInt(command.getTimeout()), command.getValue(),
                                      command.getPrefix())
                        );
            }
        } catch (SnmpException e) {
            logger.error("FullSnmpVisitor execute command failed,command is "+ ParseUtils.toJSONString(command)+",because of "+e.getMessage());
        }
        return data;
    }
}
