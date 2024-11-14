#!/bin/bash

# Function to run the deployment command
deploy() {
    npx hardhat run scripts/deploy.js --network amoy 2>&1
}

# Initialize variables for backoff
attempt=0
max_attempts=10
wait_time=5

# Loop until the deployment is successful or max attempts reached
while [ $attempt -lt $max_attempts ]; do
    echo "Attempting to deploy... (Attempt $((attempt + 1)))"
    
    # Run the deployment command and capture the output
    output=$(deploy)
    echo "$output"

    # Check if the deployment was successful
    if [[ "$output" == *"Contract Address deployed:"* ]]; then
        echo "Deployment successful!"
        exit 0
    else
        echo "Deployment failed. Checking for rate limit error..."
        
        # Check for "Too Many Requests" error in the output
        if [[ "$output" == *"Too Many Requests"* ]]; then
            echo "Rate limit hit. Waiting for $wait_time seconds before retrying..."
            sleep $wait_time
           
        else
            echo "Deployment failed for a different reason. Retrying in 5 seconds..."
            sleep 5
        fi
    fi
    
    attempt=$((attempt + 1))
done

echo "Max attempts reached. Exiting."
exit 1
