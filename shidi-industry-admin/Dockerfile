FROM openjdk:8-jre
ENV TZ=PRC

COPY shidi-industry-admin-0.0.1-SNAPSHOT.jar /app/forestry/

WORKDIR /app
EXPOSE 8114
CMD ["/bin/bash", "-c",\
"java -XX:+UnlockExperimentalVMOptions \
 -XX:+UseCGroupMemoryLimitForHeap \
 -jar /app/forestry/shidi-industry-admin-0.0.1-SNAPSHOT.jar --spring.config.location=file:/app/forestry-wetland.yaml"]