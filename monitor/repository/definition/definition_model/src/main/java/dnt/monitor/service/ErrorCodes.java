package dnt.monitor.service;

/**
 * <h1>错误码</h1>
 *
 * @author Jay Xiong
 */
public interface ErrorCodes {
    /* server throws */
    final int ROUTER_INTERNAL_ERROR     = 30000;
    final int OBJECT_NOT_FOUND          = 30001;
    final int OBJECT_DUPLICATE          = 30002;
    final int NOT_FOUND_ENGINE          = 30010;
    final int NOT_FOUND_ENGINE_SESSION  = 30011;
    final int ENGINE_IS_OFFLINE         = 30012;
    final int NOT_FOUND_PROBE           = 30013;
    final int DUPLICATE_ENGINE_REGISTER = 30014;
    final int NOT_SUPPORTED_MO          = 30015;
    final int ILLEGAL_INPUT             = 30401;

    /* engine throws */
    final int SAMPLING_BY_CACHE_MISSING = 10001;
    final int MO_RETRIEVE_ERROR         = 10002;
    final int SAMPLING_TIMEOUT          = 10003;
    final int SAMPLING_INTERRUPTED      = 10004;
    final int TASK_EXECUTE_TIMEOUT      = 10005;
    final int SAMPLE_MO_NOT_ASSIGNED    = 10006;
    final int INTERNAL_ERROR            = 10010;
    final int RESOURCE_NOT_AVAILABLE    = 10020;
    final int RESOURCE_CANNOT_RELEASE   = 10021;
    final int PROBE_INSTANTIATE_ERROR   = 10030;

    /* probe throws*/
    final int PROBE_NOT_SUPPORTED_MO_TYPE = 20010;
    final int PROBE_SAMPLE_ERROR          = 20012;
    final int PROBE_TIMEOUT               = 20013;
    final int PROBE_TOO_BIG               = 20014;
    final int PROBE_UNSUPPORTED_TYPE      = 20015;
    final int PROBE_NO_SUCH_OBJECT        = 20021;
    final int PROBE_NO_SUCH_INSTANCE      = 20022;
    final int PROBE_CONFIG_ERROR          = 20030;
    final int PROBE_AUTHORIZATION_ERROR   = 20040;
    final int PROBE_READONLY              = 20041;
    final int PROBE_BAD_INPUT             = 20042;
    final int PROBE_AUTH_INSUFFICIENT     = 20043;
}
