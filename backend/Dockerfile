# ── Stage 1: Build ─────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Cache dependencies layer separately
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Run ───────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Use wildcard - works regardless of version string in JAR name
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Pass PORT env var directly to JVM so Tomcat binds correctly
ENTRYPOINT ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
