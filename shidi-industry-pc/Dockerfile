#基于nginx镜像
# FROM nginx-hide-versions
# FROM centos7.2-nginx1.22.0:base-1.1
FROM nginx:1.22.1

MAINTAINER wangzic

#将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
# RUN  rm -rf /usr/share/nginx/html/dist
COPY dist/ /usr/share/nginx/html/industry-11181

#用本地的 nginx.conf 配置来替换nginx镜像里的默认配置
# COPY nginx.conf /usr/local/nginx/conf/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

RUN chmod 777 -R /usr/share/nginx/html/
RUN chmod 777 -R /etc/nginx/nginx.conf