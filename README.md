# ECE Pulse API
The official api for Pulse, an annual conference at UIUC that brings together hundreds of students and several corporate sponsors for a week-long celebration of technology.

## Getting Started
### Installation
Run the following commands in an open terminal in your desired folder.
```shell
git clone https://github.com/ECE-Pulse-UIUC/api.git
cd api
npm install
```
This will clone the project and install the required dependencies.

### Environment variables
Set the following environment variables in a .env file.
```shell
PORT=3000
DB_URI=<...>
```

### Running the api
```shell
node . 
```

## Development
Develop using [Github Flow](https://guides.github.com/introduction/flow/). When working on a new feature:
1. Create a branch
2. Add commits
3. Open a [Pull Request](https://github.com/ECE-Pulse-UIUC/mobile/compare/) to the `master` branch when your changes are ready to be merged  
  
The `release` branch is used to hold stable releases of the mobile application.

## License
The source code in this repository is licensed under the University of Illinois/NCSA Open Source License. For a full version of the license, view the [LICENSE](https://github.com/ECE-Pulse-UIUC/api/blob/adca64e5428ee9881f582e5f6b7a80c51a9186fd/LICENSE) file.
