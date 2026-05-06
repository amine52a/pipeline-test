FROM maven:3.9.6-amazoncorretto-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar api-gateway.jar
EXPOSE 8091
ENTRYPOINT ["java", "-jar", "api-gateway.jar"]
