using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading;
using System.Threading.Tasks;

public class HourlyMessageSender : IHostedService, IDisposable
{
    private Timer _timer;
    private readonly RabbitMQProducerService _rabbitMQService;
    private readonly string _messageToSend;

    public HourlyMessageSender(IConfiguration configuration)
    {
        var rabbitMqConfig = configuration.GetSection("RabbitMQ");
        var hostname = rabbitMqConfig["Hostname"];
        var username = rabbitMqConfig["Username"];
        var password = rabbitMqConfig["Password"];
        var queueName = rabbitMqConfig["NotificationQueue"];
        _messageToSend = rabbitMqConfig["NotificationQueue"];

        _rabbitMQService = new RabbitMQProducerService(hostname, username, password, queueName);

    
    }

    public  async Task StartAsync(CancellationToken stoppingToken)
    {
        Console.WriteLine("Hourly Message Sender Service started.");
        await _rabbitMQService.InitializeAsync();
        
        _timer = new Timer(async (state) => await DoWork(state), null, TimeSpan.Zero, TimeSpan.FromHours(1));
        return;
    }

    private async Task DoWork(object state)
    {
        Console.WriteLine($"Hourly Message Sender Service is working. Sending message at: {DateTime.Now}");
        await _rabbitMQService.SendMessage(_messageToSend);
    }

    public Task StopAsync(CancellationToken stoppingToken)
    {
        Console.WriteLine("Hourly Message Sender Service is stopping.");

        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
        _rabbitMQService?.DisposeAsync();
    }
}
