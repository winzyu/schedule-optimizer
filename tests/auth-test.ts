const { ApolloClient, InMemoryCache, gql, ApolloError, HttpLink } = require('@apollo/client');
const crossFetch = require('cross-fetch');

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface SignupData {
  signup: AuthResponse;
}

interface LoginData {
  login: AuthResponse;
}

interface SignupInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

// Create Apollo Client instance for testing
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3000/api/graphql',
    fetch: crossFetch as unknown as WindowOrWorkerGlobalScope['fetch']
  }),
  cache: new InMemoryCache()
});

const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

async function testAuth(): Promise<void> {
  console.log('Starting authentication tests...\n');

  // Test user data
  const testUser: SignupInput = {
    email: `test${Date.now()}@example.com`, // Unique email
    password: 'password123',
    name: 'Test User',
  };

  try {
    // Test 1: Sign up new user
    console.log('Test 1: Signing up new user...');
    const signupResult = await client.mutate({
      mutation: SIGNUP,
      variables: {
        input: testUser,
      },
    });

    if (!signupResult.data) {
      throw new Error('No data received from signup mutation');
    }

    const signupData = signupResult.data as SignupData;

    console.log('✅ Signup successful');
    console.log('User ID:', signupData.signup.user.id);
    console.log('Token received:', !!signupData.signup.token);
    console.log('\n');

    // Test 2: Try to sign up with same email (should fail)
    console.log('Test 2: Testing duplicate email handling...');
    try {
      await client.mutate({
        mutation: SIGNUP,
        variables: {
          input: testUser,
        },
      });
      console.log('❌ Error: Should not allow duplicate email');
    } catch (error) {
      console.log('✅ Correctly rejected duplicate email');
    }
    console.log('\n');

    // Test 3: Login with new user
    console.log('Test 3: Testing login...');
    const loginInput: LoginInput = {
      email: testUser.email,
      password: testUser.password,
    };

    const loginResult = await client.mutate({
      mutation: LOGIN,
      variables: {
        input: loginInput,
      },
    });

    if (!loginResult.data) {
      throw new Error('No data received from login mutation');
    }

    const loginData = loginResult.data as LoginData;

    console.log('✅ Login successful');
    console.log('User ID:', loginData.login.user.id);
    console.log('Token received:', !!loginData.login.token);
    console.log('\n');

    // Test 4: Login with wrong password
    console.log('Test 4: Testing invalid password handling...');
    try {
      await client.mutate({
        mutation: LOGIN,
        variables: {
          input: {
            email: testUser.email,
            password: 'wrongpassword',
          },
        },
      });
      console.log('❌ Error: Should not allow login with wrong password');
    } catch (error) {
      console.log('✅ Correctly rejected invalid password');
    }

    console.log('\nAll tests completed!');

  } catch (err: unknown) {
    // Type guard for Apollo Error
    if (err instanceof ApolloError) {
      console.error('Test failed:', err.message);
      if (err.networkError) {
        console.error('Network error:', err.networkError);
      }
      if (err.graphQLErrors) {
        console.error('GraphQL errors:', err.graphQLErrors);
      }
    } else if (err instanceof Error) {
      console.error('Test failed:', err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}

// Run the tests if this file is being run directly
if (require.main === module) {
  testAuth().catch((error: unknown) => {
    if (error instanceof Error) {
      console.error('Test execution failed:', error.message);
    } else {
      console.error('Test execution failed with unknown error');
    }
    process.exit(1);
  });
}

module.exports = { testAuth };
