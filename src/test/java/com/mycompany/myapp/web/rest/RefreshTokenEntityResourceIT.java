package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.RefreshTokenEntity;
import com.mycompany.myapp.repository.RefreshTokenEntityRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RefreshTokenEntityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RefreshTokenEntityResourceIT {

    private static final Instant DEFAULT_EXPIRY_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXPIRY_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_TOKEN = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/refresh-token-entities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RefreshTokenEntityRepository refreshTokenEntityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRefreshTokenEntityMockMvc;

    private RefreshTokenEntity refreshTokenEntity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RefreshTokenEntity createEntity(EntityManager em) {
        RefreshTokenEntity refreshTokenEntity = new RefreshTokenEntity().expiryDate(DEFAULT_EXPIRY_DATE).token(DEFAULT_TOKEN);
        return refreshTokenEntity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RefreshTokenEntity createUpdatedEntity(EntityManager em) {
        RefreshTokenEntity refreshTokenEntity = new RefreshTokenEntity().expiryDate(UPDATED_EXPIRY_DATE).token(UPDATED_TOKEN);
        return refreshTokenEntity;
    }

    @BeforeEach
    public void initTest() {
        refreshTokenEntity = createEntity(em);
    }

    @Test
    @Transactional
    void createRefreshTokenEntity() throws Exception {
        int databaseSizeBeforeCreate = refreshTokenEntityRepository.findAll().size();
        // Create the RefreshTokenEntity
        restRefreshTokenEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refreshTokenEntity))
            )
            .andExpect(status().isCreated());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeCreate + 1);
        RefreshTokenEntity testRefreshTokenEntity = refreshTokenEntityList.get(refreshTokenEntityList.size() - 1);
        assertThat(testRefreshTokenEntity.getExpiryDate()).isEqualTo(DEFAULT_EXPIRY_DATE);
        assertThat(testRefreshTokenEntity.getToken()).isEqualTo(DEFAULT_TOKEN);
    }

    @Test
    @Transactional
    void createRefreshTokenEntityWithExistingId() throws Exception {
        // Create the RefreshTokenEntity with an existing ID
        refreshTokenEntity.setId(1L);

        int databaseSizeBeforeCreate = refreshTokenEntityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRefreshTokenEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refreshTokenEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRefreshTokenEntities() throws Exception {
        // Initialize the database
        refreshTokenEntityRepository.saveAndFlush(refreshTokenEntity);

        // Get all the refreshTokenEntityList
        restRefreshTokenEntityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(refreshTokenEntity.getId().intValue())))
            .andExpect(jsonPath("$.[*].expiryDate").value(hasItem(DEFAULT_EXPIRY_DATE.toString())))
            .andExpect(jsonPath("$.[*].token").value(hasItem(DEFAULT_TOKEN)));
    }

    @Test
    @Transactional
    void getRefreshTokenEntity() throws Exception {
        // Initialize the database
        refreshTokenEntityRepository.saveAndFlush(refreshTokenEntity);

        // Get the refreshTokenEntity
        restRefreshTokenEntityMockMvc
            .perform(get(ENTITY_API_URL_ID, refreshTokenEntity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(refreshTokenEntity.getId().intValue()))
            .andExpect(jsonPath("$.expiryDate").value(DEFAULT_EXPIRY_DATE.toString()))
            .andExpect(jsonPath("$.token").value(DEFAULT_TOKEN));
    }

    @Test
    @Transactional
    void getNonExistingRefreshTokenEntity() throws Exception {
        // Get the refreshTokenEntity
        restRefreshTokenEntityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRefreshTokenEntity() throws Exception {
        // Initialize the database
        refreshTokenEntityRepository.saveAndFlush(refreshTokenEntity);

        int databaseSizeBeforeUpdate = refreshTokenEntityRepository.findAll().size();

        // Update the refreshTokenEntity
        RefreshTokenEntity updatedRefreshTokenEntity = refreshTokenEntityRepository.findById(refreshTokenEntity.getId()).get();
        // Disconnect from session so that the updates on updatedRefreshTokenEntity are not directly saved in db
        em.detach(updatedRefreshTokenEntity);
        updatedRefreshTokenEntity.expiryDate(UPDATED_EXPIRY_DATE).token(UPDATED_TOKEN);

        restRefreshTokenEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRefreshTokenEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRefreshTokenEntity))
            )
            .andExpect(status().isOk());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeUpdate);
        RefreshTokenEntity testRefreshTokenEntity = refreshTokenEntityList.get(refreshTokenEntityList.size() - 1);
        assertThat(testRefreshTokenEntity.getExpiryDate()).isEqualTo(UPDATED_EXPIRY_DATE);
        assertThat(testRefreshTokenEntity.getToken()).isEqualTo(UPDATED_TOKEN);
    }

    @Test
    @Transactional
    void putNonExistingRefreshTokenEntity() throws Exception {
        int databaseSizeBeforeUpdate = refreshTokenEntityRepository.findAll().size();
        refreshTokenEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRefreshTokenEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, refreshTokenEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(refreshTokenEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRefreshTokenEntity() throws Exception {
        int databaseSizeBeforeUpdate = refreshTokenEntityRepository.findAll().size();
        refreshTokenEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefreshTokenEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(refreshTokenEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRefreshTokenEntity() throws Exception {
        int databaseSizeBeforeUpdate = refreshTokenEntityRepository.findAll().size();
        refreshTokenEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefreshTokenEntityMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(refreshTokenEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRefreshTokenEntityWithPatch() throws Exception {
        // Initialize the database
        refreshTokenEntityRepository.saveAndFlush(refreshTokenEntity);

        int databaseSizeBeforeUpdate = refreshTokenEntityRepository.findAll().size();

        // Update the refreshTokenEntity using partial update
        RefreshTokenEntity partialUpdatedRefreshTokenEntity = new RefreshTokenEntity();
        partialUpdatedRefreshTokenEntity.setId(refreshTokenEntity.getId());

        partialUpdatedRefreshTokenEntity.expiryDate(UPDATED_EXPIRY_DATE).token(UPDATED_TOKEN);

        restRefreshTokenEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRefreshTokenEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRefreshTokenEntity))
            )
            .andExpect(status().isOk());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeUpdate);
        RefreshTokenEntity testRefreshTokenEntity = refreshTokenEntityList.get(refreshTokenEntityList.size() - 1);
        assertThat(testRefreshTokenEntity.getExpiryDate()).isEqualTo(UPDATED_EXPIRY_DATE);
        assertThat(testRefreshTokenEntity.getToken()).isEqualTo(UPDATED_TOKEN);
    }

    @Test
    @Transactional
    void fullUpdateRefreshTokenEntityWithPatch() throws Exception {
        // Initialize the database
        refreshTokenEntityRepository.saveAndFlush(refreshTokenEntity);

        int databaseSizeBeforeUpdate = refreshTokenEntityRepository.findAll().size();

        // Update the refreshTokenEntity using partial update
        RefreshTokenEntity partialUpdatedRefreshTokenEntity = new RefreshTokenEntity();
        partialUpdatedRefreshTokenEntity.setId(refreshTokenEntity.getId());

        partialUpdatedRefreshTokenEntity.expiryDate(UPDATED_EXPIRY_DATE).token(UPDATED_TOKEN);

        restRefreshTokenEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRefreshTokenEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRefreshTokenEntity))
            )
            .andExpect(status().isOk());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeUpdate);
        RefreshTokenEntity testRefreshTokenEntity = refreshTokenEntityList.get(refreshTokenEntityList.size() - 1);
        assertThat(testRefreshTokenEntity.getExpiryDate()).isEqualTo(UPDATED_EXPIRY_DATE);
        assertThat(testRefreshTokenEntity.getToken()).isEqualTo(UPDATED_TOKEN);
    }

    @Test
    @Transactional
    void patchNonExistingRefreshTokenEntity() throws Exception {
        int databaseSizeBeforeUpdate = refreshTokenEntityRepository.findAll().size();
        refreshTokenEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRefreshTokenEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, refreshTokenEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(refreshTokenEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRefreshTokenEntity() throws Exception {
        int databaseSizeBeforeUpdate = refreshTokenEntityRepository.findAll().size();
        refreshTokenEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefreshTokenEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(refreshTokenEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRefreshTokenEntity() throws Exception {
        int databaseSizeBeforeUpdate = refreshTokenEntityRepository.findAll().size();
        refreshTokenEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRefreshTokenEntityMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(refreshTokenEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RefreshTokenEntity in the database
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRefreshTokenEntity() throws Exception {
        // Initialize the database
        refreshTokenEntityRepository.saveAndFlush(refreshTokenEntity);

        int databaseSizeBeforeDelete = refreshTokenEntityRepository.findAll().size();

        // Delete the refreshTokenEntity
        restRefreshTokenEntityMockMvc
            .perform(delete(ENTITY_API_URL_ID, refreshTokenEntity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RefreshTokenEntity> refreshTokenEntityList = refreshTokenEntityRepository.findAll();
        assertThat(refreshTokenEntityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
