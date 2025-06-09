package com.chinatower.wetland.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Base64;


@Slf4j
public class BASE64DecodedMultipartFileUtil  implements MultipartFile {

    private final byte[] imgContent;
    private final String header;
    private static final String PNG_PATH = "D:\\home\\data\\output.";

    public BASE64DecodedMultipartFileUtil(byte[] imgContent, String header) {
        this.imgContent = imgContent;
        this.header = header.split(";")[0];
    }

    @Override
    public String getName() {
        return System.currentTimeMillis() + Math.random() + "." + header.split("/")[1];
    }

    @Override
    public String getOriginalFilename() {
        return System.currentTimeMillis() + (int) (Math.random() * 10000) + "." + header.split("/")[1];
    }

    @Override
    public String getContentType() {
        return header.split(":")[1];
    }

    @Override
    public boolean isEmpty() {
        return imgContent == null || imgContent.length == 0;
    }

    @Override
    public long getSize() {
        return imgContent.length;
    }

    @Override
    public byte[] getBytes() throws IOException {
        return imgContent;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(imgContent);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {

        try (FileOutputStream fileOutputStream = new FileOutputStream(dest)) {
            fileOutputStream.write(imgContent);
        } catch (Exception e) {
            log.info("transferTo: " + e.getMessage());
        }
    }


    public static String base64ToFile(String base64Str, String fileType) {
        String imagePath = PNG_PATH + fileType; // 图片将被保存到这个路径
        try (FileOutputStream fos = new FileOutputStream(imagePath)) {
            byte[] imageBytes = Base64.getDecoder().decode(base64Str);
            fos.write(imageBytes);
            fos.flush();
            return imagePath;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}

