const { mapKeys, camelCase } = require('lodash');
const { getContentModelType } = require('./helpers');
const pageTransform = require('./transformers/page');

const transformers = {
  'node-page': pageTransform,
};

const missingTransformers = new Set();

/**
 * Returns the proper function for transforming a specific entity type.
 * If no transformer exists for the entity type, it returns a function
 * that will return the entity unmodified, and it will log a warning.
 *
 * @param {String} entityType - The type of the entity
 * @return {Function} - A function that accepts an entity and transforms it
 */
function getEntityTransformer(entityType, verbose = true) {
  let entityTransformer;

  if (entityType in transformers) {
    entityTransformer = transformers[entityType];
  } else if (verbose && !missingTransformers.has(entityType)) {
    missingTransformers.add(entityType);
    // eslint-disable-next-line no-console
    console.warn(`No transformer for target_id ${entityType}`);
  }

  return entityTransformer;
}

/**
 * Takes the entity type and entity contents and returns a new
 * entity with modified data to fit the content model.
 *
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion and property
 *                          transformation.
 *
 * @return {Object} - The entity with modified properties based on
 *                    the specific content model type.
 */
function transformEntity(entity) {
  const entityTransformer = getEntityTransformer(getContentModelType(entity));

  // Convert all snake_case keys to camelCase
  const transformed = mapKeys(entity, (v, k) => camelCase(k));

  return entityTransformer ? entityTransformer(transformed) : transformed;
}

module.exports = {
  transformEntity,
  getEntityTransformer,
};