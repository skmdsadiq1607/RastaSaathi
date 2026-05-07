import PropTypes from 'prop-types';
import HospitalCard from './HospitalCard';
export default function HospitalRankList({ hospitals, selectedId }) { return <div className="space-y-3">{hospitals.map((item) => <HospitalCard key={item.hospital?._id || item._id} item={item} selected={(item.hospital?._id || item._id) === selectedId} />)}</div>; }
HospitalRankList.propTypes = { hospitals: PropTypes.arrayOf(PropTypes.object), selectedId: PropTypes.string };
HospitalRankList.defaultProps = { hospitals: [], selectedId: '' };
