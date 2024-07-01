document.getElementById('convertButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    
    if (!fileInput.files.length) {
        alert('Please select a CSV file first.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const csv = e.target.result;
        const results = Papa.parse(csv, {
            header: true,
            dynamicTyping: true
        });

        const json = JSON.stringify(results.data, null, 2);
        
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    reader.readAsText(file);
});
