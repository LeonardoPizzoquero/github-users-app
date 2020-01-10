import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default function User({ navigation }) {
  const [stars, setStars] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const user = navigation.getParam('user');

  async function loadUser(currentPage = 1) {
    const response = await api.get(`/users/${user.login}/starred`, {
      params: { currentPage },
    });

    setStars(page >= 2 ? [...stars, response.data] : response.data);
    setPage(currentPage);
    setRefreshing(false);
    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function loadMore() {
    const nextPage = page + 1;
    loadUser(nextPage);
  }

  function refreshList() {
    setRefreshing(true);
    setStars([]);
    loadUser();
  }

  function handleNavigate(repository) {
    navigation.navigate('Repository', { repository });
  }

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      {loading ? (
        <Loading />
      ) : (
          <Stars
            onEndReachedThreshold={0.2}
            onEndReached={loadMore}
            onRefresh={refreshList}
            refreshing={refreshing}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
