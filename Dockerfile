# ----------- STAGE 1: Build JAR -----------
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy ONLY backend
COPY library-backend/pom.xml .
COPY library-backend/mvnw .
COPY library-backend/.mvn .mvn
COPY library-backend/src ./src

# Make mvnw executable
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests=true


# ----------- STAGE 2: Run Application -----------
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
