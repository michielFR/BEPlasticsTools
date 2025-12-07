let calculationMode = 'collie';

// Ensure at least one product exists
function addProduct() {
  const productContainer = $('#productContainer');
  const productItem = $('<div class="product-item"></div>');
  productItem.html(`
                   <div class="form-row pt-2 align-items-center">
                      <div class="col-md-3 d-flex align-items-center">
                        <label for="productValue" class="mr-2 mb-0">MFI</label>
                        <input type="number" class="form-control" name="productValue[]" placeholder="MFI" step="any"
                          required>
                      </div>
                      <div class="col-md-3 d-flex align-items-center">
                        <label for="collieQuantity" class="mr-2 mb-0">Collies</label>
                        <input type="number" class="form-control collie-input" name="collieQuantities[]" placeholder="Collies"
                          step="any" required>
                      </div>
                      <div class="col-md-3 d-flex align-items-center">
                        <label for="productPercentage" class="mr-2 mb-0">Percentage</label>
                        <input type="number" class="form-control percentage-input" name="productPercentage[]" placeholder="Percentage" step="any" required disabled>
                      </div>
                      <div class="col text-right">
                        <button type="button" class="btn btn-danger btn-sm delete-product" onclick="deleteProduct(this)"
                          disabled>
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    `);
  productContainer.append(productItem);

  // Enable delete buttons
  updateDeleteButtons();
}

function deleteProduct(button) {
  const productContainer = $('#productContainer');
  if (productContainer.children().length > 1) {
    button.closest('.product-item').remove();
  }
  // Disable delete buttons if only one product remains
  updateDeleteButtons();
}

function updateDeleteButtons() {
  const productContainer = $('#productContainer');
  const deleteButtons = productContainer.find('.delete-product');
  deleteButtons.each(function () {
    this.disabled = productContainer.children().length === 1;
  });

  $('.collie-input').off('change').on('change', function () {
    $('.percentage-input').val('');
  });
}

// Perform the calculation on form submission
function calculateResult(event) {
  event.preventDefault(); // Prevent form submission

  const productValues = document.getElementsByName('productValue[]');
  const collieQuantities = document.getElementsByName('collieQuantities[]');
  const productPercentages = document.getElementsByName('productPercentage[]');
  var productPercentageValues = Array(productValues.length).fill(0);
  var totalCollies = 0;

  if (calculationMode === 'collie') {
    for (let i = 0; i < collieQuantities.length; i++) {
      const quantity = parseFloat(collieQuantities[i].value);
      if (isNaN(quantity)) {
        alert('Gelieve een geldig aantal collies in te voeren.');
        return;
      }
      totalCollies += quantity;
    }

    for (let i = 0; i < collieQuantities.length; i++) {
      const quantity = parseFloat(collieQuantities[i].value);
      const percentage = (quantity / totalCollies) * 100;
      productPercentageValues[i] = percentage.toFixed(2);
    }
  } else {
    let percentageSum = 0;
    for (let i = 0; i < productPercentages.length; i++) {
      const percentage = parseFloat(productPercentages[i].value);
      if (isNaN(percentage)) {
        alert('Gelieve een geldig percentage in te voeren.');
        return;
      }
      percentageSum += percentage;
    }
    if (percentageSum !== 100) {
      alert('De som van de percentages moet 100 zijn.');
      return;
    }
  }

  let sum = 0;
  for (let i = 0; i < productValues.length; i++) {
    const value = parseFloat(productValues[i].value);
    const percentage = calculationMode === 'collie' ? parseFloat(productPercentageValues[i]) : parseFloat(productPercentages[i].value);

    if (isNaN(value) || isNaN(percentage) || value <= 0) {
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
  resultDiv.innerHTML = `<p><strong>Resultaat:</strong> ${reversedLog.toFixed(2)} ${(calculationMode === 'collie' ? ' - <strong>Collies:</strong> ' +  totalCollies : '')}</p>`;

  if (calculationMode === 'collie') {
    const $percentageInputs = $('.percentage-input');
    for (let i = 0; i < $percentageInputs.length; i++) {
      $percentageInputs.eq(i).val(productPercentageValues[i]);
    }
  }
}

// Initialize with one product
document.addEventListener('DOMContentLoaded', () => {
  updateDeleteButtons();
});

function toggleMode(mode) {
  const collieBtn = $('#collieBtn');
  const percentageBtn = $('#percentageBtn');
  var actionTitleText = $('#action-title').html();
  if (mode === 'collie') {
    calculationMode = 'collie';
    collieBtn.addClass('active');
    percentageBtn.removeClass('active');
    actionTitleText = actionTitleText.replace('percentage', 'aantal collies');
    $('.percentage-input').prop('disabled', true);
    $('.collie-input').prop('disabled', false);
    $('.percentage-input').val('');
    $('#action-title').html(actionTitleText);
  } else {
    calculationMode = 'percentage';
    percentageBtn.addClass('active');
    collieBtn.removeClass('active');
    actionTitleText = actionTitleText.replace('aantal collies', 'percentage');
    $('.percentage-input').prop('disabled', false);
    $('.collie-input').prop('disabled', true);
    $('.collie-input').val('');
    $('#action-title').html(actionTitleText);
  }
}

$('.collie-input').off('change').on('change', function () {
  $('.percentage-input').val('');
});
