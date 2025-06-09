package com.chinatower.wetland.exception;


import com.chinatower.common.entity.Result;
import com.chinatower.common.entity.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.BatchUpdateException;
import java.sql.SQLIntegrityConstraintViolationException;


/**
 * <p>全局异常处理器</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 处理请求对象属性不满足校验规则的异常信息
     *
     * @param exception
     * @return
     * @throws Exception
     */
    @ExceptionHandler(value = SQLIntegrityConstraintViolationException.class)
    public Result<Boolean> exception(SQLIntegrityConstraintViolationException exception) {
        if (exception.getMessage().endsWith("key 'PRIMARY'")){
            return Result.data(Boolean.TRUE);
        }else {
            log.error(exception.getMessage());
            return Result.fail();
        }
    }

    /**
     * 处理自定义异常信息
     *
     * @param e
     * @return
     * @throws BaseBizException
     */
    @ExceptionHandler(value = BaseBizException.class)
    public Result<String> exception(BaseBizException e) {
        return Result.fail(ResultCode.FAILURE.getCode(),e.getMessage());
    }

    /**
     * 用于捕获@RequestParam 必传参数触发校验规则抛出的异常
     * @param e
     * @return
     * @throws MissingServletRequestParameterException
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    private Result<String> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        return Result.fail(ResultCode.GLOBAL_PARAM_ERROR,e.getMessage());
    }

    /**
     * 用于捕获@RequestParam 必传参数触发校验规则抛出的异常
     * @param e
     * @return
     * @throws MethodArgumentNotValidException
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    private Result<String> methodArgumentNotValidException(MethodArgumentNotValidException e) {
        return Result.fail(ResultCode.GLOBAL_PARAM_ERROR,e.getMessage());
    }

    /**の
     * 用于捕获区域名字唯一校验异常
     * @param e
     * @return
     * @throws BatchUpdateException
     */
    /*@ExceptionHandler(DuplicateKeyException.class)
    private Result<String> duplicateKeyException(DuplicateKeyException e) {
        return Result.fail(ResultCode.GLOBAL_PARAM_ERROR,"区域名称重复");
    }*/

    /**
     * 捕捉所有的异常
     * @param e
     * @return
     * @throws Exception
     */
    @ExceptionHandler(Exception.class)
    private Result<String> exception(Exception e) {
        e.printStackTrace();
        return Result.fail(e.getMessage());
    }
}
