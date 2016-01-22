function synonymsList(){
    return {
        'tenantId': {'tableName':'product','synonyms':['tenant','tenantid', 'tenantno', 'tenant no']},
        'productId': {'tableName':'product','synonyms':['product', 'productid', 'productno', 'product no']},
        'supplierId': {'tableName':'product','synonyms':['supplier', 'supplierid', 'supplierno', 'supplierno']},
        'mfgProductId': {'tableName':'product','synonyms':['mfgProduct', 'mfgproductid', 'mfgproductno', 'mfgproduct no']},
        'manufacturerId': {'tableName':'product','synonyms':['manufacturer', 'manufacturerid', 'manufacturerno', 'manufacturer no']},
        'extProductId': {'tableName':'product','synonyms':['extProduct', 'extProductid', 'extproductno', 'extproduct no']},
        'variantId': {'tableName':'variants','synonyms':['variant', 'variantid', 'variantno', 'variant no']},
        'languageId': {'tableName':'tableName','synonyms':['language', 'languageid', 'languageno', 'language no']},
        'classificationId': {'tableName':'classificationGroupAssociations','synonyms':['classification', 'classificationid', 'classificationno', 'classification no']},
        'classificationGroupId': {'tableName':'classificationGroupAssociations','synonyms':['classificationGroup', 'classificationGroupid', 'classificationGroupno', 'classificationGroup no']},
        'extClassificationId': {'tableName':'contractedProducts','synonyms':['extClassification', 'extClassificationid', 'extClassificationno', 'extClassification no']},
        'extClassificationGroupId': {'tableName':'contractedProducts','synonyms':['extClassificationGroup','extClassificationno', 'extClassificationGroupid', 'extClassification no']},
        'priceTypeId': {'tableName':'prices','synonyms':['priceType', 'priceTypeid', 'priceTypeno', 'priceType no']},
        'relatedProductId': {'tableName':'productRelations','synonyms':['relatedProduct', 'relatedProductid', 'relatedProductno', 'relatedProduct no']}
    }   
}

exports.synonymsList = synonymsList;