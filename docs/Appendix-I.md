## GitLab CI/CD pipeline definition file


Here is the final `.gitlab-ci.yml` file including the test stage from [Task 14 - Edit CI/CD](Task14_Edit_CI-CD.md):

``` yaml title=".gitlab-ci.yml"
---
image: danischm/nac:0.1.6
stages:
  - validate
  - plan
  - deploy
  - test
  - notify

variables:
  # Disable SSL verification for git operations
  GIT_SSL_NO_VERIFY: "true"

  IOSXE_USERNAME:
    description: "Cisco IOS XE Username"
  IOSXE_PASSWORD:
    description: "Cisco IOS XE Password"
  IOSXE_PROTOCOL:
    description: "Cisco IOS XE connection protocol"
    value: "netconf"
  GITLAB_TOKEN:
    description: "User Access Token. Used to create comments on Merge Requests"
  TF_HTTP_USERNAME:
    description: "GitLab Username"
    value: "gitlab-ci-token"
  TF_HTTP_PASSWORD:
    description: "GitLab Access Token"
    value: "${CI_JOB_TOKEN}"
  WEBEX_ROOM_ID:
    description: "Cisco Webex Room ID"
  WEBEX_TOKEN:
    description: "Cisco Webex Bot Token"
  GITLAB_API_URL:
    description: "GitLab API v4 root URL"
    value: "${CI_API_V4_URL}"
  TF_HTTP_ADDRESS:
    description: "GitLab HTTP Address to store the TF state file"
    value: "${GITLAB_API_URL}/projects/${CI_PROJECT_ID}/terraform/state/tfstate"
  TF_HTTP_LOCK_ADDRESS:
    description: "GitLab HTTP Address to lock the TF state file"
    value: ${TF_HTTP_ADDRESS}/lock
  TF_HTTP_LOCK_METHOD:
    description: "Method to lock TF state file"
    value: POST
  TF_HTTP_UNLOCK_ADDRESS:
    description: "GitLab HTTP Address to unlock the TF state file"
    value: ${TF_HTTP_ADDRESS}/lock
  TF_HTTP_UNLOCK_METHOD:
    description: "Method to unlock TF state file"
    value: DELETE

cache:
  key: terraform_modules_and_lock
  paths:
    - .terraform
    - .terraform.lock.hcl
    - defaults.yaml
    - model.yaml

validate:
  stage: validate
  script:
    - set -o pipefail && terraform fmt -check |& tee fmt_output.txt
    - set -o pipefail && nac-validate ./data/ |& tee validate_output.txt
  artifacts:
    paths:
      - fmt_output.txt
      - validate_output.txt
  cache: []
  rules:
    - if: $CI_COMMIT_TAG == null

plan:
  stage: plan
  resource_group: iosxe
  script:
    - terraform init -upgrade -input=false
    - terraform plan -out=plan.tfplan -input=false
    - terraform show -no-color plan.tfplan > plan.txt
    - terraform show -json plan.tfplan | jq > plan.json
    - terraform show -json plan.tfplan | jq '([.resource_changes[]?.change.actions?]|flatten)|{"create":(map(select(.=="create"))|length),"update":(map(select(.=="update"))|length),"delete":(map(select(.=="delete"))|length)}' > plan_gitlab.json
    - python3 .ci/gitlab-comment.py
  artifacts:
    paths:
      - plan.json
      - plan.txt
      - plan.tfplan
      - plan_gitlab.json
    reports:
      terraform: plan_gitlab.json
  dependencies: []
  needs:
    - validate
  only:
    - merge_requests
    - main

deploy:
  stage: deploy
  resource_group: iosxe
  script:
    - terraform init -input=false
    - terraform apply -input=false -auto-approve plan.tfplan
  artifacts:
    paths:
      - defaults.yaml
  dependencies:
    - plan
  needs:
    - plan
  only:
    - main

test-integration:
  stage: test
  script:
    - set -o pipefail && nac-test --data ./model.yaml --data ./defaults.yaml --templates ./tests/templates --filters ./tests/filters --output ./tests/results |& tee test_output.txt
  artifacts:
    when: always
    paths:
      - tests/results/*.html
      - tests/results/xunit.xml
      - test_output.txt
    reports:
      junit: tests/results/xunit.xml
  dependencies:
    - deploy
  needs:
    - deploy
  only:
    - main

test-idempotency:
  stage: test
  resource_group: iosxe
  script:
    - terraform init -input=false
    - terraform plan -input=false -detailed-exitcode
  dependencies:
    - deploy
  needs:
    - deploy
  only:
    - main

failure:
  stage: notify
  script:
    - python3 .ci/webex-notification-gitlab.py -f
  when: on_failure
  artifacts:
    when: always
    paths:
      - tests/results/*.html
      - tests/results/xunit.xml
      - plan.txt
      - fmt_output.txt
      - validate_output.txt
      - test_output.txt
  cache: []

success:
  stage: notify
  script:
    - python3 .ci/webex-notification-gitlab.py -s
  when: on_success
  artifacts:
    when: always
    paths:
      - tests/results/*.html
      - tests/results/xunit.xml
      - plan.txt
      - fmt_output.txt
      - validate_output.txt
      - test_output.txt
  cache: []
```

---

**← Previous:** [Conclusion](Workend01_conclusion.md)  ·  **Next:** [Appendix II - Schema reference](Appendix-II.md)
