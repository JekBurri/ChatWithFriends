using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using WatchTogetherSignalR.Models;

namespace WatchTogetherSignalR.Hubs
{
    public class DrawHub : Hub
    {
        private readonly SharedDb _shared;

        public DrawHub(SharedDb shared) => _shared = shared;

        public async Task SaveDrawing(string drawingId, Dictionary<string, object> drawingData)
        {
            // string key = drawingId.ToString();

            Console.WriteLine($"\n**SharedDb drawings before update (JSON):**\n{JsonConvert.SerializeObject(_shared.drawings)}");

            // Attempt to update the existing entry if it exists, otherwise add a new one
            if (!_shared.drawings.TryAdd(drawingId, new DrawConnection { DrawingId = drawingId, DrawingData = drawingData }))
            {
                // If TryAdd fails, it means the key already exists, so update the value
                _shared.drawings[drawingId] = new DrawConnection { DrawingId = drawingId, DrawingData = drawingData };

                Console.WriteLine($"\n**SharedDb drawings after update (JSON):**\n{JsonConvert.SerializeObject(_shared.drawings)}");
                Console.WriteLine($"Drawing saved: {drawingId}");

                // Send the updated drawing to all clients
                await Clients.All.SendAsync("ReceiveDrawing", drawingData);
            }

            // Other parts of the method remain unchanged
            Console.WriteLine($"Drawing saved: {drawingId}");
        }


        public async Task GetDrawing(string drawingId)
        {
            if (_shared.drawings.TryGetValue(drawingId, out DrawConnection drawConnection))
            {
                Console.WriteLine($"\n**SharedDb drawing details (JSON):**\n{JsonConvert.SerializeObject(_shared.drawings)}");

                await Clients.Caller.SendAsync("GetDrawing", drawConnection.DrawingData);
            }
        }
    }
}
