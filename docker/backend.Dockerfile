FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /workspace
COPY backend/pom.xml backend/mvnw backend/mvnw.cmd ./
COPY backend/.mvn ./.mvn
RUN mvn --batch-mode dependency:go-offline

COPY backend/src ./src
RUN mvn --batch-mode package -DskipTests

FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 3001

ENTRYPOINT ["java", "-jar", "app.jar"]
