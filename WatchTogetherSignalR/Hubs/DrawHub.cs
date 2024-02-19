using Microsoft.AspNetCore.SignalR;
using Microsoft.OpenApi.Any;
using System.Threading.Tasks;
using WatchTogetherSignalR.Models;

namespace WatchTogetherSignalR.Hubs
{
    public class DrawHub : Hub
    {
        private readonly SharedDb _shared;

        public DrawHub(SharedDb shared) => _shared = shared;

        public async Task SaveDrawing(int drawingId, Dictionary<string, object> drawingData)
        {
            _shared.drawings.TryAdd(drawingId.ToString(), new DrawConnection { DrawingId = drawingId, DrawingData = drawingData });

            await Clients.All.SendAsync("ReceiveDrawing", drawingData);

            // Add a console log to confirm that SaveDrawing was called
            Console.WriteLine($"Drawing saved: {drawingId}");
        }

    }
}
