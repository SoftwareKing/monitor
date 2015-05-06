package dnt.monitor.meta.sampling;

import dnt.monitor.service.sampling.TransformerHandler;

import java.io.Serializable;

public class MetaTransformer implements Serializable{
    private Class<? extends TransformerHandler> clazz = TransformerHandler.class;

    public Class<? extends TransformerHandler> getClazz() {
        return clazz;
    }

    public void setClazz(Class<? extends TransformerHandler> clazz) {
        this.clazz = clazz;
    }

    private static final long serialVersionUID = -5755711126534625408L;
}
