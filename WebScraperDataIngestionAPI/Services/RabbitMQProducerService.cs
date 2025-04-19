using RabbitMQ.Client;
using System;
using System.Text;
using System.Threading.Tasks;

public class RabbitMQProducerService : IAsyncDisposable
{
    private readonly ConnectionFactory _factory;
    private IConnection _connection;
    private IChannel _channel;
    private readonly string _queueName;
    private bool Initialized = false;

    public RabbitMQProducerService(string hostname, string username, string password, string queueName)
    {
        _factory = new ConnectionFactory() { HostName = hostname, UserName = username, Password = password };

        Console.WriteLine(queueName);
        _queueName = queueName;
    }

    public async Task InitializeAsync()
    {
        if (Initialized) {
            Console.WriteLine($"RabbitMQProducerService: connection already initialized");
            return;
        }
        try
        {
            _connection = await _factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await _channel.QueueDeclareAsync(queue: _queueName,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error connecting to RabbitMQ: {ex.Message}");
            // Consider logging the error and handling the failure appropriately
            throw;
        }
    }

    public async Task SendMessage(string message)
    {
        if (_channel == null || !_channel.IsOpen)
        {
            Console.WriteLine("Warning: RabbitMQ channel is not open. Cannot send message.");
            return;
        }

        var body = Encoding.UTF8.GetBytes(message);

        await _channel.BasicPublishAsync(exchange: "",
                             routingKey: _queueName,
                             body: body);

        Console.WriteLine($" [x] Sent '{message}' to queue '{_queueName}'");
    }

    public async ValueTask DisposeAsync()
    {
        if (_channel != null && _channel.IsOpen)
        {
            try
            {
                await _channel.CloseAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error closing RabbitMQ channel: {ex.Message}");
            }
        }
        if (_connection != null && _connection.IsOpen)
        {
            try
            {
                await _connection.CloseAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error closing RabbitMQ connection: {ex.Message}");

            }
        }
    }
}
