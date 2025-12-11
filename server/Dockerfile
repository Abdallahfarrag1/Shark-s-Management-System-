# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy csproj and restore
COPY *.csproj ./
RUN dotnet restore

# copy everything and publish
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# copy published files
COPY --from=build /app/publish ./

# Default port - Render provides PORT env at runtime
# Use shell entrypoint to set ASPNETCORE_URLS from PORT env var if provided
EXPOSE 5000

ENV DOTNET_RUNNING_IN_CONTAINER=true

ENTRYPOINT ["/bin/sh", "-lc", "export ASPNETCORE_URLS=\"http://+:${PORT:-5000}\" && dotnet backend.dll"]
