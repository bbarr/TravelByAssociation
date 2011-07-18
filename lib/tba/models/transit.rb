class Transit
  include MongoMapper::EmbeddedDocument
  
  key :date
  key :means
end