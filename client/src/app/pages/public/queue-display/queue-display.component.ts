import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-queue-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-8 flex gap-8">
      <!-- Left: Now Serving -->
      <div class="w-1/3 flex flex-col gap-6">
        <div class="bg-gray-800 rounded-2xl p-8 text-center border-l-8 border-green-500 shadow-2xl">
          <h2 class="text-3xl font-light text-gray-400 mb-4">NOW SERVING</h2>
          <div class="text-9xl font-bold text-white mb-6">A12</div>
          <div class="text-2xl text-green-400 font-bold">Counter 3</div>
        </div>

        <div
          class="bg-gray-800 rounded-2xl p-8 text-center border-l-8 border-blue-500 shadow-2xl opacity-80"
        >
          <h2 class="text-2xl font-light text-gray-400 mb-2">NEXT</h2>
          <div class="text-7xl font-bold text-white mb-4">A13</div>
          <div class="text-xl text-blue-400">Please Wait</div>
        </div>
      </div>

      <!-- Right: Queue List -->
      <div class="w-2/3 bg-gray-800 rounded-2xl p-8 shadow-2xl">
        <h2 class="text-4xl font-bold mb-8 border-b border-gray-700 pb-4">Waiting List</h2>

        <div class="space-y-4">
          <div class="grid grid-cols-3 text-gray-400 text-xl font-medium px-4 mb-2">
            <div>Ticket</div>
            <div>Customer</div>
            <div class="text-right">Est. Wait</div>
          </div>

          @for (item of queue; track item.id) {
          <div class="grid grid-cols-3 items-center bg-gray-700 p-6 rounded-xl text-2xl">
            <div class="font-bold text-white">{{ item.ticket }}</div>
            <div class="text-gray-300">{{ item.name }}</div>
            <div class="text-right font-mono text-yellow-400">{{ item.waitTime }} min</div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class QueueDisplayComponent {
  queue = [
    { id: 2, ticket: 'A13', name: 'John Doe', waitTime: 15 },
    { id: 3, ticket: 'A14', name: 'Mike Ross', waitTime: 35 },
    { id: 4, ticket: 'A15', name: 'Harvey Specter', waitTime: 50 },
    { id: 5, ticket: 'A16', name: 'Louis Litt', waitTime: 65 },
  ];
}
