package com.chinatower.wetland;

import lombok.extern.slf4j.Slf4j;
import org.jasypt.encryption.StringEncryptor;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)
@Slf4j
public class EncryptorTest {
    @Autowired
    private StringEncryptor stringEncryptor;

    @Test
    public void testEncryptor() {
       log.info("测试：=================================================：" + stringEncryptor.encrypt("nacos"));

    }
    @Test
    public void testDecryptor() {
        log.info("测试：=================================================：" + stringEncryptor.decrypt("WDFbi4qd0CW2LJYAeaagh8Iz7UZ6qFditecXJIS8V7PEpqB+KbCHyY+tu7J/N4lrhzf679B9v40CwYVDOYXLiQ=="));
    }

}
