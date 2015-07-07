# boldworkflow
Demonstration of BoldChat Workflow APIs

This is a demonstration of the Workflow API available in the 8.0 BoldChat release.  The code is broken up into 3 main process:

broker.js:  This script runs the main brokerage service between the chat and voice micro services.  It is responsible for the sychronication of state between both system.   A helper index.html file has been added to view the state of the broker.

voicesim.js:  This script simulates the activities of a voice system.  If this reference code were to be integrated with a production voice system, this script would be deprecated.

boldchatsim:  This script simulates the BoldChat micros servcies.  This script will be deprecated once the Workflow API is available in production.

