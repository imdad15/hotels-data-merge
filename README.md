# Hotels Data Merge

A Node.js service that aggregates and merges hotel data from multiple suppliers into a unified API.

## Features And Design Decisions

- **Multi-Source Integration**: 
  - Fetches hotel data from multiple suppliers (ACME, Patagonia, Paperflies)
  - Each supplier has its own data format and field naming conventions. In real world scenario, there will likely be different ways to authenticate and fetch data as well. So this requires a uniform interface to handle different suppliers.
  - **Implementation**:
    - Adapter pattern to handle different supplier APIs.
    - Common interface for normalized hotel data.

- **Data Normalization**: 
  - Standardizes hotel information across different formats.
  - **Implementation**:
    - Field mapping from supplier-specific to common format.
    - Type conversion and validation.
    - Default values for missing fields.
    - Deduplication of amenities and other list-type fields.[Limited check]

- **Merging**:
  - Combines duplicate hotel entries from different sources
  - **Implementation**:
    - Priority-based field selection.
    - Congigurable rules-based field selection. [Limited implementation for the scope of this assessment]


- **Caching**:
  - Redis-based caching layer for fast response
  - **Implementation**:
    - Save merged hotel data in Redis
    - Use Redis as a cache/storage for hotel data to get fast response

- **Scheduled Updates**:
  - Regular data refresh from suppliers
  - **Implementation**:
    - Cron-based scheduling

## Tech Stack
- **Runtime**: Node.js 16+ (container)
- **Language**: TypeScript
- **Framework**: Express.js
- **Storage/Caching**: Redis (container)
- **Testing**: Jest
- **Linting/Formatting**: Prettier
- **Development**: Docker + Dev Containers

## Prerequisites

- [Docker](https://www.docker.com/get-started/)
- [VS Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)[optional]

## Running the Application

### Using Docker

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/hotels-data-merge.git](https://github.com/yourusername/hotels-data-merge.git)
   cd hotels-data-merge
   ```

2. Run `docker compose up` to start the containers.

OR

Open the project in VS Code and open the dev container. Wait for the dev container to be built and start