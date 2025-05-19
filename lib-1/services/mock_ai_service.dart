class MockAIService {
  // Simulates a response from an AI
  String getResponse(String userInput) {
    // Here you can define mock responses based on user input
    if (userInput.contains("hello")) {
      return "Hello! How can I assist you today?";
    } else if (userInput.contains("help")) {
      return "Sure! What do you need help with?";
    } else {
      return "I'm not sure how to respond to that.";
    }
  }
}