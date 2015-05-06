package dnt.monitor.meta.sampling;

import dnt.monitor.service.sampling.CommandHandler;

import java.io.Serializable;

public class MetaCommand implements Serializable {

    private Class<? extends CommandHandler> clazz = CommandHandler.class;

    private String value;

    private String timeout = "1m";

    private String mappingName = "map";

    private MappingType mappingType = MappingType.MAP;

    public String getMappingName() {
        return mappingName;
    }

    public void setMappingName(String mappingName) {
        this.mappingName = mappingName;
    }

    public MappingType getMappingType() {
        return mappingType;
    }

    public void setMappingType(MappingType mappingType) {
        this.mappingType = mappingType;
    }

    public Class<? extends CommandHandler> getClazz() {
        return clazz;
    }

    public void setClazz(Class<? extends CommandHandler> clazz) {
        this.clazz = clazz;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getTimeout() {
        return timeout;
    }

    public void setTimeout(String timeout) {
        this.timeout = timeout;
    }

    private static final long serialVersionUID = -3835079351160071137L;
}
