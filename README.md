# boldworkflow
Boldworkflow is a reference code set that demonstrates the BoldChat 8.0 WorkFlow API features.  More information on this feature can be found a http://help.boldchat.com/help/BoldChat/c_bc_api_workflow.html.

This code demonstrates 2 primary use cases: Operator status control/monitoring and offboard operator routing of incoming chat sessions.  This code has been build so that it can be easily cloned an run against an BoldChat account using a free Heroku account.

The project is currently under development so documentaiotn is still minimal.  The main two files used in the sample broker application include the following:

broker.js:  This script acts as a broker to the BoldChat service.  It accepts events from the BoldChat service, makes API calls to change config settings or acquire informaiton, and serves up data to a web page.

index.html:  This is an HTML page with included javascript to accept and send data to the broker.ja file.

As mentioned before, development is currently in progress.  Please email mtroyer@logmein.com with any comments.



