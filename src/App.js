import Detail from "./Components/Detail";
import Footer from "./Components/Footer";
import RepoList from "./Components/RepoList";
import Search from "./Components/Search";
import { github } from "./utils";
import { useEffect, useState } from "react";
import FollowersList from "./Components/FollowersList";
import FollowingList from "./Components/FollowingList";
function App() {
  const [detail, setDetail] = useState({});
  const [repo, setRepoList] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [userName, setUserName] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [visibleComponent, setVisibleComponent] = useState(2);

  useEffect(
    (_) => {
      setDetail({});
      setIsSuccess(true);
      (async (_) => {
        try {
          const response = await github.get(`/${userName}`);
          console.log(response.data);
          setDetail(response.data);
        } catch (e) {
          setIsSuccess(false);
        }
      })();
    },
    [userName]
  );

  useEffect(
    (_) => {
      setRepoList([]);
      (async (_) => {
        const repoResponse = await github.get(`/${userName}/repos`);

        setRepoList(repoResponse.data);
      })();
    },
    [userName]
  );
  useEffect(
    (_) => {
      setFollowerList([]);
      (async (_) => {
        const followers = await github.get(`/${userName}/followers`);
        setFollowerList(followers.data);
      })();
    },
    [userName]
  );
  useEffect(
    (_) => {
      setFollowingList([]);
      (async (_) => {
        const response = await github.get(`/${userName}/following`);
        setFollowingList(response.data);
        console.log(response.data);
      })();
    },
    [userName]
  );

  const searchUserName = (keyword) => setUserName(keyword);

  const showLoadMore = () => {
    if (visibleComponent === 1) {
      if (followerList.length === detail.followers) {
        return false;
      } else {
        return true;
      }
    } else if (visibleComponent === 2) {
      if (repo.length === detail.public_repos) {
        return false;
      } else {
        return true;
      }
    } else {
      if (followingList.length === detail.following) {
        return false;
      } else {
        return true;
      }
    }
  };
  const loadMore = async (_) => {
    if (visibleComponent === 1) {
      const currentPage = Math.ceil(followerList.length / 30);
      const nextPage = currentPage + 1;
      const response = await github.get(`/${userName}/followers?page=${nextPage} `);
      const list = response.data;

      setFollowerList(currentList => {
        const newList = [...currentList, ...list];
        return newList;
      });
    } else if (visibleComponent === 2) {
      const currentPage = Math.ceil(repo.length / 30);
      const nextPage = currentPage + 1;
      const response = await github.get(`/${userName}/repos?page=${nextPage}`);
      const list = response.data;
      setRepoList(currentList => {
        const newList = [...currentList, ...list];
        return newList;
      });
    } else {
      const currentPage = Math.ceil(followingList.length / 30);
      const nextPage = currentPage + 1;
      const response = await github.get(`/${userName}/following?page=${nextPage}`);
      const list = response.data;
      setFollowingList(currentList => {
        const newList = [...currentList, ...list];
        return newList;
      });
    }
  };

  return (
    <main>
      <Search searchUserName={searchUserName} isSuccess={isSuccess} />
      {detail.id === undefined ? (
        false
      ) : (
        <>
          <Detail
            detail={detail}
            changeVisibleComponent={setVisibleComponent}
          />
          {visibleComponent === 1 ? (
            <FollowersList detail={followerList} />
          ) : visibleComponent === 2 ? (
            <RepoList detail={repo} />
          ) : (
            <FollowingList detail={followingList} />
          )}
        </>
      )}
      {showLoadMore() === true ? (
        <div className="card load-more">
          <button onClick={loadMore}>Load More</button>
          {console.log(followingList)}
        </div>
      ) : (
        false
      )}

      <Footer />
    </main>
  );
}

export default App;
