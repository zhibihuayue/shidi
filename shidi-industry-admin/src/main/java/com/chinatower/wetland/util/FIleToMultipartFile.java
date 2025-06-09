package com.chinatower.wetland.util;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.Serializable;

public class FIleToMultipartFile implements Serializable {
    /**
     * MultipartFile 转 File
     *
     * @param multipartFile
     * @throws Exception
     */
    public static File multiPartFileToFile3(MultipartFile multipartFile) {
        File file = null;
        if (multipartFile.isEmpty()) {
            return null;
        }
        try {
            //本质上还是在项目根路径创建文件
            file = new File(multipartFile.getOriginalFilename());

            //将MultipartFile的byte[]写入到file中
            FileUtils.writeByteArrayToFile(file, multipartFile.getBytes());

        } catch (IOException e) {
            e.printStackTrace();
        }
        return file;
    }

    /**
     * MultipartFile转File
     * <p>
     * 项目根路径创建临时文件，转换得到File，再删除临时文件
     *
     * @param multipartFile
     * @return
     */
    public static File multiPartFileToFile(MultipartFile multipartFile) throws IOException {

        //获取文件名
        String originalFilename = multipartFile.getOriginalFilename();

        //获取默认定位到的当前用户目录("user.dir"),也就是当前应用的根路径
        String tempDir = System.getProperty("user.dir");

        //根目录下生成临时文件
        File file = new File(tempDir+ File.separator+originalFilename);

        FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), file);

        return file;
    }



    /**
     * MultipartFile转File
     * <p>
     * 项目根路径创建缓冲区来实现这个转换
     *
     * @param multipartFile
     * @return
     */
    public static File multiPartFileToFile2(MultipartFile multipartFile) throws IOException {

        //获取文件名
        String originalFilename = multipartFile.getOriginalFilename();

        //获取默认定位到的当前用户目录("user.dir"),也就是当前应用的根路径
        String tempDir = System.getProperty("user.dir");

        //获取文件名
        assert originalFilename != null;
        String filename = originalFilename.substring(0, originalFilename.lastIndexOf("."));
        //获取文件后缀
        String fileExt = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);

        //在项目根路径生成临时文件
        File tempFile = File.createTempFile(filename, "." + fileExt, new File(tempDir));

        multipartFile.transferTo(tempFile);

        //在jvm退出时执行删除此路径下的文件
        tempFile.deleteOnExit();

        return tempFile;
    }

    // file 转 MultipartFile ==============================================================================
    /**
     * 将File类型转换为MultipartFile类型的文件
     * @param file 要转换的File对象
     * @return 转换后的MultipartFile对象
     * @throws IOException 如果读取文件时发生错误
     */
    public static MultipartFile convertFileToMultipartFile(File file) {
        MultipartFile multipartFile = null;
        try {
            FileInputStream input = new FileInputStream(file);
            multipartFile = new MockMultipartFile(
                    file.getName(), // 原始文件名
                    file.getName(), // 也可以是自定义的文件名
                    "application/octet-stream", // 文件类型，根据实际情况调整
                    IOUtils.toByteArray(input) // 文件内容转换为字节数组
            );
            input.close(); // 关闭输入流
        } catch (IOException e) {
            e.printStackTrace();
        }
        return multipartFile;
    }

}