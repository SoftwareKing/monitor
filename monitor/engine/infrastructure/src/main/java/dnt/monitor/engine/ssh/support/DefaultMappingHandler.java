package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.exception.SshException;
import dnt.monitor.engine.ssh.MappingHandler;
import dnt.monitor.meta.ssh.MetaMapping;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.spring.Bean;
import net.happyonroad.support.DefaultGeneralMap;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

/**
 * <h1>解析并封装指令返回结果</h1>
 *
 * @author mnnjie
 */
@SuppressWarnings("unused")
@Component
public class DefaultMappingHandler extends Bean implements MappingHandler {

    public GeneralMap<String, Object> handleMap(MetaMapping metaMapping, String resultText) throws SshException {
        return handleTable(metaMapping, resultText).get(0);
    }

    public List<GeneralMap<String, Object>> handleTable(MetaMapping metaMapping, String resultText) throws SshException {
        if (metaMapping == null || StringUtils.isBlank(resultText)) {
            throw new SshException(400, "mapping or resultText is null or empty");
        }

        String[] rows = resultText.split(metaMapping.getRowSeparator());
        String[] headers = metaMapping.getValue();
        boolean customHeaders = headers.length > 0;
        if (rows.length <= metaMapping.getSkipLines() + (customHeaders ? 0 : 1)) {
            throw new SshException(400, "not enough rows for mapping:skip=" + metaMapping.getSkipLines() + "," +
                                        (customHeaders ? "" : "need header line") + ",text=" + resultText);
        }

        List<GeneralMap<String, Object>> dataList = new ArrayList<GeneralMap<String, Object>>();
        for (int i = metaMapping.getSkipLines(); i < rows.length; i++) {
            String rowText = rows[i];
            String[] cols = rowText.split(metaMapping.getColSeparator());
            if (i == metaMapping.getSkipLines() && !customHeaders) {
                headers = cols;
                continue;
            }
            if (cols.length != headers.length) {
                logger.warn("cols num not match headers num,headers is [{}],rowText is [{}]",
                            StringUtils.join(headers, " "), rowText);
                continue;
            }
            GeneralMap<String, Object> data = new DefaultGeneralMap<String, Object>();
            for (int j = 0; j < headers.length; j++) {
                data.put(headers[j], cols[j]);
            }
            dataList.add(data);
        }
        return dataList;
    }

}
