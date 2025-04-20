import { initializeSocket, getSocket, disconnectSocket } from './socket';
import { io } from 'socket.io-client';

jest.mock('socket.io-client', () => {
	return {
		io: jest.fn(),
	};
});

describe('Socket module', () => {
	let mockSocket;

	beforeEach(() => {
		mockSocket = {
			disconnect: jest.fn(),
		};
		io.mockReturnValue(mockSocket);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should initialize socket with correct URL and auth', () => {
		process.env.MODE = 'development';
		initializeSocket('123');
		expect(io).toHaveBeenCalledWith('http://localhost:5000', {
			auth: { userId: '123' },
		});
	});

	test('should disconnect previous socket on re-initialization', () => {
		initializeSocket('123');
		initializeSocket('456');
		expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
	});

	test('getSocket should return socket if initialized', () => {
		initializeSocket('123');
		const result = getSocket();
		expect(result).toBe(mockSocket);
	});

	test('getSocket should throw error if not initialized', () => {
		disconnectSocket(); // make sure it's null
		expect(() => getSocket()).toThrow('Socket not initialized');
	});

	test('disconnectSocket should call disconnect and nullify socket', () => {
		initializeSocket('123');
		disconnectSocket();
		expect(mockSocket.disconnect).toHaveBeenCalled();
	});
});
