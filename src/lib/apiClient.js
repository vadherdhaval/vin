export class APIClient {
    constructor(apiUrl) {
      this.apiUrl = apiUrl;
    }
  
    async fetchData(endpoint) {
        try {
            const url = `${this.apiUrl}/${endpoint}?format=json`;
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error('Failed to fetch data');
            }
            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}