package dnt.monitor.engine.shell.support;

import dnt.monitor.engine.exception.ShellException;
import dnt.monitor.engine.shell.MappingHandler;
import dnt.monitor.meta.shell.MetaMapping;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.spring.Bean;
import net.happyonroad.support.DefaultGeneralMap;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <h1>解析并封装指令返回结果</h1>
 *
 * @author mnnjie
 */
@SuppressWarnings("unused")
@Component
class DefaultMappingHandler extends Bean implements MappingHandler {

    public GeneralMap<String, Object> handleMap(MetaMapping metaMapping, String resultText) throws ShellException {
        return handleTable(metaMapping, resultText).get(0);
    }

    //TODO 支持 宽度对齐的表解析 assigned to MengJie
    public List<GeneralMap<String, Object>> handleTable(MetaMapping metaMapping, String resultText)
            throws ShellException {
        if (metaMapping == null || StringUtils.isBlank(resultText)) {
            throw new ShellException(400, "mapping or resultText is null or empty");
        }

        String[] rows = resultText.split(metaMapping.getRowSeparator());
        String[] headers = metaMapping.getValue();
        boolean customHeaders = headers.length > 0;
        Pattern pattern = null;
        if (metaMapping.getPattern() != null && !metaMapping.getPattern().isEmpty()) {
            pattern = Pattern.compile(metaMapping.getPattern());
        }
        List<GeneralMap<String, Object>> dataList = new ArrayList<GeneralMap<String, Object>>();
        for (int i = 0; i < rows.length; i++) {
            String rowText = rows[i];
            String[] cols = split(metaMapping, rowText, pattern);
            if( cols == null ) continue;
            if (i == 0 && !customHeaders) {
                headers = cols;
                continue;
            }
            //if (cols.length != headers.length) {
            //logger.warn("cols num not match headers num,headers is [{}],rowText is [{}]",
            //            StringUtils.join(headers, " "), rowText);
            //continue;
            //}
            GeneralMap<String, Object> data = new DefaultGeneralMap<String, Object>();
            for (int j = 0; j < headers.length; j++) {
                String colValue = j < cols.length ? cols[j] : null;
                data.put(headers[j], colValue);
            }
            dataList.add(data);
        }
        return dataList;
    }

    private List<Integer> parseAnchors(MetaMapping metaMapping, String row) {
        //各个列的锚点
        List<Integer> anchors = new ArrayList<Integer>();
        // row as:
        // Filesystem    1G-blocks Used Available Capacity  Mounted on
        String[] heads = row.split(metaMapping.getColSeparator());
        int start = 0;
        anchors.add(start);
        for (int i = 1; i < heads.length; i++) {
            String head = heads[i];
            int anchor = row.indexOf(head, start);
            anchors.add(anchor);
            start = anchor;
        }
        return anchors;
    }

    protected String[] split(MetaMapping metaMapping, String rowText, Pattern pattern) {
        if (pattern != null) {
            Matcher matcher = pattern.matcher(rowText);
            if (matcher.matches()) {
                String[] result = new String[matcher.groupCount()];
                for (int i = 1; i <= matcher.groupCount(); i++) {
                    result[i - 1] = matcher.group(i);
                }
                return result;
            } else {
                logger.warn("Skip row {} does not match {}", rowText, pattern);
                return null;
            }
        } else {
            return rowText.split(metaMapping.getColSeparator());
        }
    }

}
