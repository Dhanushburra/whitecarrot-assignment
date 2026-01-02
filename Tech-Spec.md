Assumptions:
1. A recruiter can only add 1 company, and multiple recruiters cannot edit the same company
2. Each companies data is isolated and not visible and cross company access is not provided
3. Careers and recruiter page is publicly accessed and recruiter url is not hidden
4. There is no flow after browsing jobs. A candidate cannot apply for jobs currently, as it is a future scope

Architecture:
1. There are 3 entities: Company, recruiter, candidate
2. There are 5 tables: Company, Content, Jobs and Recruiter
3. It is a relational cloud postgress database 
4. End to end test plan includes:
    a. Recruiter signup
    b. Add company details
    c. Add job details
    d. Apply changes

    e. Candidate browse jobs with filters
    
    f. Recruiter login to modify details related to content and jobs
    g. Recruiter previews page
    h. Apply changes

    i. Candidate sees dynamically rendered page
