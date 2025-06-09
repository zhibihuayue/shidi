package com.chinatower.wetland.exception;


import com.chinatower.common.entity.ResultCode;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>自定义异常</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>w
 * @see
 */
@Getter
@Setter
public class BaseBizException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
    
	/**
	 * 异常码
	 */
	private final  int  code;

	public BaseBizException(int code, String message) {
		super(message);
		this.code = code;
	}

	public BaseBizException(String message) {
		super(message);
		this.code = ResultCode.FAILURE.getCode();
	}

	public BaseBizException(int code, Throwable cause) {
		this(code, cause.getMessage().isEmpty() ? cause.getLocalizedMessage() : cause.getMessage());
	}

}
