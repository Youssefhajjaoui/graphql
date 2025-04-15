# Use the official Go image for building the application
FROM golang:1.20 as build

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application source code
COPY . .

# Build the Go application
RUN go build -o main cmd/main.go

# Use a lightweight image for running the application
FROM debian:bookworm-slim

# Install necessary tools (e.g., CA certificates)
RUN apt-get update && apt-get install -y \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /root/

# Copy the built binary and assets from the builder stage
COPY --from=build /app/main .
COPY --from=build /app/web ./web

# Expose the port your application runs on
EXPOSE 8000

# Command to run the application
CMD ["./main"]