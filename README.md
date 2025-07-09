# Project Instructions

## 1. Generate Page Objects

1. Open the Secondary Side Bar (top right corner) in VS Code. You can also open it using `Ctrl + Alt + B`.
2. In the prompt window area (bottom right), make sure you are in agent mode (see the dropdown on the bottom left side of the chat).
3. Click **Add context** and search for `create-pom-rules.md` files.
4. Enter a prompt in the chat window to generate *all* the pages for your application.  
   *Be sure to provide your Application URL.*
5. **Note:** Make sure the context you added in step 3 is still active. If not, keep the `create-pom-rules.md` file open to enforce the context.
6. Review the generated results.  
   *If you want to make changes, update your prompt.*
7. Continue following the prompt and update your pages according to your knowledge and AI-generated suggestions.
8. Verify that the newly created pages meet your requirements.

## 2. Create Test Cases

1. In the Secondary Side Bar, click **Add context** and search for the `generate-test-cases.md` file to add it in context.
2. Enter a prompt to generate test cases based on the pages you created.
3. **Note:** Make sure the context you added in step 1 is still active. If not, keep the `generate-test-cases.md` file open to enforce the context.
4. Review the generated results.  
   *If you want to make changes, update your prompt.*
5. Continue following the prompt and update your test cases according to your knowledge and AI-generated suggestions.
6. Verify that the newly created tests meet your requirements.  
   **Note:** The test run should start automatically. If not, prompt the agent to do it.

## On Test Failure

When a test fails, you can:

1. **Prompt for test fixes**, then analyze the results to accept or reject the changes.
2. **Use Playwright’s "Copy Prompt" function** to analyze and fix the tests.
3. **Run the test in debug mode** to step through each test step.
4. **Raise a bug** if the failure appears to be genuine.