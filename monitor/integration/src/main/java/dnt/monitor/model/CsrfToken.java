/**
 * xiongjie on 14-8-11.
 */
package dnt.monitor.model;

/**
 * <h1>The csrf token entity</h1>
 */
public class CsrfToken {
    private String headerName;
    private String parameterName;
    private String token;

    public String getHeaderName() {
        return headerName;
    }

    public void setHeaderName(String headerName) {
        this.headerName = headerName;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}
