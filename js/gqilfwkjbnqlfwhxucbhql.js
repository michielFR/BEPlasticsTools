
    // Ensure at least one product exists
    function addProduct() {
      const productContainer = document.getElementById('productContainer');
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
        <div class="form-row pt-2 align-items-center">
                    <div class="col-md-3 d-flex align-items-center">
                      <label for="productValue" class="mr-2 mb-0">MFI</label>
                      <input type="number" class="form-control" name="productValue[]" placeholder="MFI" step="any" required>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                      <label for="productPercentage" class="mr-2 mb-0">Percentage</label>
                      <input type="number" class="form-control" name="productPercentage[]" placeholder="Percentage" step="any" required>
                    </div>
                    <div class="col text-right">
                      <button type="button" class="btn btn-danger btn-sm delete-product" onclick="deleteProduct(this)" disabled>
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
      `;
      productContainer.appendChild(productItem);
  
      // Enable delete buttons
      updateDeleteButtons();
    }
  
    function deleteProduct(button) {
      const productContainer = document.getElementById('productContainer');
      if (productContainer.children.length > 1) {
        button.closest('.product-item').remove();
      }
      // Disable delete buttons if only one product remains
      updateDeleteButtons();
    }
  
    function updateDeleteButtons() {
      const productContainer = document.getElementById('productContainer');
      const deleteButtons = productContainer.querySelectorAll('.delete-product');
      deleteButtons.forEach(button => {
        button.disabled = productContainer.children.length === 1;
      });
    }
  
    // Perform the calculation on form submission
    function calculateResult(event) {
      event.preventDefault(); // Prevent form submission
  
      const productValues = document.getElementsByName('productValue[]');
      const productPercentages = document.getElementsByName('productPercentage[]');

      let percentageSum = 0;
      for (let i = 0; i < productPercentages.length; i++) {
        const percentage = parseFloat(productPercentages[i].value);
        if (isNaN(percentage)) {
          alert('Gelieve een geldige percentage in te voeren.');
          return;
        }
        percentageSum += percentage;
      }
      if (percentageSum !== 100) {
        alert('De som van de percentages moet 100 zijn.');
        return;
      }

      let sum = 0;
  
      for (let i = 0; i < productValues.length; i++) {
        const value = parseFloat(productValues[i].value);
        const percentage = parseFloat(productPercentages[i].value);
  
        if (isNaN(value) || isNaN(percentage) || value<= 0) {
          alert('Gelieve voor alle velden een geldige waarde in te voeren.');
          return;
        }
  
        // Calculate log10(value) * percentage
        const logValue = Math.log10(value);
        const currentProductValue = logValue * (percentage / 100);
        sum += currentProductValue;
      }
  
      // Calculate the reversed log10 of the sum
      const reversedLog = Math.pow(10, sum);
  
      // Display the result
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `<p><strong>Resultaat:</strong> ${reversedLog.toFixed(2)}</p>`;
    }
  
    // Initialize with one product
    document.addEventListener('DOMContentLoaded', () => {
      updateDeleteButtons();
    });

