export const JSON_FIXTURES = {
  valid: [
    null,
    { a: 1 },
    ['a', 2, null],
    [{ a: null, b: 2, c: [{ foo: 'bar' }] }],
  ],
  invalid: [
    undefined,
    Symbol('bar'),
    Promise.resolve(),
    () => 'foo',
    [{ a: undefined }],
  ],
};

export const JSON_RPC_NOTIFICATION_FIXTURES = {
  valid: [
    {
      jsonrpc: '2.0',
      method: 'notify',
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      params: {
        foo: 'bar',
      },
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      params: ['foo'],
    },
  ],
  invalid: [
    {},
    [],
    true,
    false,
    null,
    undefined,
    1,
    'foo',
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'notify',
    },
    {
      jsonrpc: '1.0',
      method: 'notify',
    },
    {
      jsonrpc: 2.0,
      method: 'notify',
    },
    {
      jsonrpc: '2.0',
      method: {},
    },
    {
      jsonrpc: '2.0',
      method: [],
    },
    {
      jsonrpc: '2.0',
      method: true,
    },
    {
      jsonrpc: '2.0',
      method: false,
    },
    {
      jsonrpc: '2.0',
      method: null,
    },
    {
      jsonrpc: '2.0',
      method: undefined,
    },
    {
      jsonrpc: '2.0',
      method: 1,
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      params: true,
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      params: false,
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      params: null,
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      params: 1,
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      params: '',
    },
  ],
};

export const JSON_RPC_REQUEST_FIXTURES = {
  valid: [
    {
      jsonrpc: '2.0',
      method: 'notify',
      id: 1,
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      id: '1',
      params: {
        foo: 'bar',
      },
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      id: 'foo',
      params: ['foo'],
    },
    {
      jsonrpc: '2.0',
      method: 'notify',
      id: null,
    },
  ],
  invalid: [
    {},
    [],
    true,
    false,
    null,
    undefined,
    1,
    'foo',
    {
      id: 1,
      jsonrpc: '1.0',
      method: 'notify',
    },
    {
      id: 1,
      jsonrpc: 2.0,
      method: 'notify',
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: {},
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: [],
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: true,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: false,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: null,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: undefined,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: 1,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'notify',
      params: true,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'notify',
      params: false,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'notify',
      params: null,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'notify',
      params: 1,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'notify',
      params: '',
    },
  ],
};

export const JSON_RPC_SUCCESS_FIXTURES = {
  valid: [
    {
      id: 1,
      jsonrpc: '2.0',
      result: 'foo',
    },
    {
      id: '1',
      jsonrpc: '2.0',
      result: {
        foo: 'bar',
      },
    },
    {
      id: 'foo',
      jsonrpc: '2.0',
      result: null,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      result: [
        {
          foo: 'bar',
        },
      ],
    },
  ],
  invalid: [
    {},
    [],
    true,
    false,
    null,
    undefined,
    1,
    'foo',
    {
      jsonrpc: '2.0',
      result: 'foo',
    },
    {
      id: 1,
      result: 'foo',
    },
    {
      id: 1,
      jsonrpc: '2.0',
    },
    {
      id: 1,
      jsonrpc: '1.0',
      result: 'foo',
    },
    {
      id: 1,
      jsonrpc: 2.0,
      result: 'foo',
    },
    {
      id: 1,
      jsonrpc: '2.0',
      result: undefined,
    },
    {
      id: {},
      jsonrpc: '2.0',
      result: 'foo',
    },
    {
      id: [],
      jsonrpc: '2.0',
      result: 'foo',
    },
    {
      id: true,
      jsonrpc: '2.0',
      result: 'foo',
    },
    {
      id: false,
      jsonrpc: '2.0',
      result: 'foo',
    },
    {
      id: undefined,
      jsonrpc: '2.0',
      result: 'foo',
    },
  ],
};

export const JSON_RPC_FAILURE_FIXTURES = {
  valid: [
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: '1',
      jsonrpc: '2.0',
      error: {
        code: -32001,
        message: 'Internal error',
        data: {
          foo: 'bar',
        },
      },
    },
    {
      id: 'foo',
      jsonrpc: '2.0',
      error: {
        code: -32002,
        message: 'Internal error',
        data: ['foo'],
        stack: 'bar',
      },
    },
    {
      id: 'foo',
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error',
        data: 'foo',
      },
    },
    {
      id: 'foo',
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error',
        data: 1,
      },
    },
  ],
  invalid: [
    {},
    [],
    true,
    false,
    null,
    undefined,
    1,
    'foo',
    {
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
    },
    {
      id: {},
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: [],
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: true,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: false,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: undefined,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '1.0',
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: 2.0,
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: {},
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: [],
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: true,
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: false,
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: null,
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: undefined,
      error: {
        code: -32000,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -32000,
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: [],
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {},
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: true,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: false,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: null,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: undefined,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: 'foo',
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: 1,
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: {},
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: [],
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: true,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: false,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: null,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: undefined,
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: 'foo',
        message: 'Internal error',
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: {},
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: [],
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: true,
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: false,
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: null,
      },
    },
    {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: undefined,
      },
    },
  ],
};

export const JSON_RPC_RESPONSE_FIXTURES = {
  valid: [
    ...JSON_RPC_SUCCESS_FIXTURES.valid,
    ...JSON_RPC_FAILURE_FIXTURES.valid,
  ],
  invalid: [
    ...JSON_RPC_SUCCESS_FIXTURES.invalid,
    ...JSON_RPC_FAILURE_FIXTURES.invalid,
  ],
};
