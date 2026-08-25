FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /workspace
COPY pom.xml mvnw mvnw.cmd ./
COPY .mvn ./.mvn
RUN mvn --batch-mode dependency:go-offline

COPY src ./src
RUN mvn --batch-mode package -DskipTests

FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=3s --start-period=25s --retries=5 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3001/api/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
