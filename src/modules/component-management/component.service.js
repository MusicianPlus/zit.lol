const componentRepository = require('./component.repository');

exports.findOrCreateComponent = async (componentData, allMappedFields) => {
    let component = await componentRepository.findByManufacturerPartNumber(componentData.manufacturer_part_number);

    if (!component) {
        // Eğer bileşen mevcut değilse, tüm eşlenmiş alanları kullanarak yeni bir kayıt oluştur
        component = await componentRepository.create(allMappedFields);
    } else {
        // Eğer bileşen mevcutsa, var olan kaydı güncelle
        component = await componentRepository.update(component.component_id, allMappedFields);
    }

    return component;
};

exports.getComponentColumns = async () => {
    return await componentRepository.getColumns();
};

exports.getAllComponents = async () => {
    return await componentRepository.getAllComponents();
};